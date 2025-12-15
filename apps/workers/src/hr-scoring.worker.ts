/**
 * HR Scoring Worker
 * Processes candidate scoring jobs using GPT-4o
 */
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import OpenAI from 'openai';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ScoringJobData {
    submissionId: string;
    orgId: string;
    candidateName: string;
    answers: Record<string, string>;
    rubricVersion: string;
}

interface ScoreOutput {
    overall: number;
    categories: {
        experience: number;
        skills: number;
        communication: number;
        cultureFit: number;
    };
    summary: string;
    redFlags: string[];
    evidence: Array<{
        category: string;
        quote: string;
        reasoning: string;
    }>;
}

const SCORING_PROMPT = `You are an expert HR evaluator. Score this candidate based on their questionnaire responses.

Candidate: {candidateName}

Responses:
{answers}

Score the candidate on a 0-100 scale overall, with 0-25 for each category:
- Experience: Relevant work history and accomplishments
- Skills: Technical and professional competencies
- Communication: Clarity, professionalism, and articulation
- Culture Fit: Alignment with company values and team dynamics

Output your evaluation as JSON with this exact structure:
{
  "overall": <0-100>,
  "categories": {
    "experience": <0-25>,
    "skills": <0-25>,
    "communication": <0-25>,
    "cultureFit": <0-25>
  },
  "summary": "<50-500 char summary of the candidate>",
  "redFlags": ["<any concerns or red flags>"],
  "evidence": [
    {
      "category": "<category name>",
      "quote": "<relevant quote from their response>",
      "reasoning": "<why this supports your score>"
    }
  ]
}`;

async function scoreCandidate(data: ScoringJobData): Promise<ScoreOutput> {
    const answersText = Object.entries(data.answers)
        .map(([q, a]) => `Q: ${q}\nA: ${a}`)
        .join('\n\n');

    const prompt = SCORING_PROMPT
        .replace('{candidateName}', data.candidateName)
        .replace('{answers}', answersText);

    if (!OPENAI_API_KEY) {
        console.warn('[HR Scoring] No OpenAI API key, returning mock score');
        return {
            overall: 75,
            categories: {
                experience: 18,
                skills: 20,
                communication: 19,
                cultureFit: 18,
            },
            summary: 'Mock evaluation - configure OPENAI_API_KEY for real scoring.',
            redFlags: [],
            evidence: [],
        };
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: 'You are an expert HR evaluator. Output only valid JSON.' },
            { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as ScoreOutput;
}

async function processScoring(job: Job<ScoringJobData>): Promise<void> {
    const { submissionId, candidateName } = job.data;

    console.log(`[HR Scoring] Processing submission ${submissionId} for ${candidateName}`);

    const score = await scoreCandidate(job.data);

    console.log(`[HR Scoring] Score for ${candidateName}: ${score.overall}/100`);
    console.log(`[HR Scoring] Categories:`, score.categories);

    if (score.redFlags.length > 0) {
        console.log(`[HR Scoring] Red flags:`, score.redFlags);
    }

    // TODO: Save score to database via ScoreRepository
    console.log(`[HR Scoring] Completed submission ${submissionId}`);
}

export function startHrScoringWorker(): Worker {
    const connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });

    const worker = new Worker<ScoringJobData>('hr-scoring', processScoring, {
        connection,
        concurrency: 2, // Limit concurrency due to API rate limits
    });

    worker.on('completed', (job) => {
        console.log(`[HR Scoring] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        console.error(`[HR Scoring] Job ${job?.id} failed:`, err);
    });

    console.log('[HR Scoring] Worker started');

    return worker;
}

// Export for testing
export { scoreCandidate };
