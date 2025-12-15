import { Injectable } from '@nestjs/common';
import { HrScoringService } from '../../domain/services/hr-scoring.service';
import { SubmissionRepository } from '../../infrastructure/persistence/submission.repository';
import { ScoreRepository } from '../../infrastructure/persistence/score.repository';
import { ScoringAiService } from '../../infrastructure/ai/scoring-ai.service';
import { SubmissionNotFoundError } from '../../domain/errors';
import { HrScoreOutput } from '@nous/shared';

export interface ScoreCandidateCommand {
    submissionId: string;
    rubricVersion: string;
}

export interface ScoreCandidateResult {
    scoreId: string;
    overall: number;
    categories: HrScoreOutput['categories'];
    summary: string;
    redFlags: string[];
}

@Injectable()
export class ScoreCandidateUseCase {
    constructor(
        private readonly hrScoringService: HrScoringService,
        private readonly submissionRepository: SubmissionRepository,
        private readonly scoreRepository: ScoreRepository,
        private readonly scoringAiService: ScoringAiService
    ) { }

    async execute(command: ScoreCandidateCommand): Promise<ScoreCandidateResult> {
        // Get submission
        const submission = await this.submissionRepository.findById(command.submissionId);
        if (!submission) {
            throw new SubmissionNotFoundError(command.submissionId);
        }

        // Generate AI score
        const aiResult = await this.scoringAiService.scoreCandidate(
            submission.answersJson,
            command.rubricVersion
        );

        // Create score entity
        const score = this.hrScoringService.createScore({
            submissionId: command.submissionId,
            rubricVersion: command.rubricVersion,
            modelId: aiResult.modelId,
            scoreJson: aiResult.score,
        });

        await this.scoreRepository.save(score);

        return {
            scoreId: score.id,
            overall: score.getOverallScore(),
            categories: score.scoreJson.categories,
            summary: score.scoreJson.summary,
            redFlags: score.scoreJson.redFlags,
        };
    }
}
