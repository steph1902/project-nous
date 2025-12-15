import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { HrScoreOutput, HrScoreOutputSchema } from '@nous/shared';
import { ScoringError } from '../../domain/errors';

export interface ScoringResult {
    score: HrScoreOutput;
    modelId: string;
}

@Injectable()
export class ScoringAiService {
    private openai: OpenAI | null = null;

    constructor(private readonly config: ConfigService) { }

    private getClient(): OpenAI {
        if (!this.openai) {
            const apiKey = this.config.get<string>('OPENAI_API_KEY');
            if (!apiKey) {
                throw new ScoringError('OPENAI_API_KEY not configured');
            }
            this.openai = new OpenAI({ apiKey });
        }
        return this.openai;
    }

    async scoreCandidate(
        answers: Record<string, string>,
        rubricVersion: string
    ): Promise<ScoringResult> {
        const modelId = 'gpt-4o';

        const systemPrompt = `You are an HR scoring assistant. Evaluate the candidate based on their answers using the following rubric.

Scoring Rubric (${rubricVersion}):
- Experience (0-25): Evaluate years and relevance
- Technical Skills (0-25): Evaluate skill match
- Communication (0-25): Evaluate clarity and professionalism
- Culture Fit (0-25): Evaluate alignment with company values

Return a valid JSON object with this exact structure:
{
  "overall": <number 0-100>,
  "categories": {
    "experience": <number 0-25>,
    "skills": <number 0-25>,
    "communication": <number 0-25>,
    "cultureFit": <number 0-25>
  },
  "summary": "<150-250 word assessment>",
  "redFlags": ["<concern 1>", "<concern 2>"]
}`;

        const userPrompt = `Please score the following candidate responses:

${Object.entries(answers)
                .map(([question, answer]) => `**${question}**: ${answer}`)
                .join('\n\n')}

Provide your scoring in the exact JSON format specified.`;

        try {
            const response = await this.getClient().chat.completions.create({
                model: modelId,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new ScoringError('Empty response from AI');
            }

            const parsed = JSON.parse(content);
            const validated = HrScoreOutputSchema.parse(parsed);

            return { score: validated, modelId };
        } catch (error) {
            if (error instanceof ScoringError) throw error;

            throw new ScoringError(
                `Failed to score candidate: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}
