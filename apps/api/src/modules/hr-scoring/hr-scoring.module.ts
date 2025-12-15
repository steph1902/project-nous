import { Module } from '@nestjs/common';
import { HrScoringService } from './domain/services/hr-scoring.service';
import { CreateCandidateUseCase } from './application/use-cases/create-candidate.use-case';
import { SubmitAnswersUseCase } from './application/use-cases/submit-answers.use-case';
import { ScoreCandidateUseCase } from './application/use-cases/score-candidate.use-case';
import { GetCandidateRankingsUseCase } from './application/use-cases/get-rankings.use-case';
import { CandidateRepository } from './infrastructure/persistence/candidate.repository';
import { SubmissionRepository } from './infrastructure/persistence/submission.repository';
import { ScoreRepository } from './infrastructure/persistence/score.repository';
import { HrScoringController } from './infrastructure/controllers/hr-scoring.controller';
import { ScoringAiService } from './infrastructure/ai/scoring-ai.service';

@Module({
    controllers: [HrScoringController],
    providers: [
        // Domain Services
        HrScoringService,

        // Use Cases
        CreateCandidateUseCase,
        SubmitAnswersUseCase,
        ScoreCandidateUseCase,
        GetCandidateRankingsUseCase,

        // Repositories
        CandidateRepository,
        SubmissionRepository,
        ScoreRepository,

        // AI
        ScoringAiService,
    ],
    exports: [HrScoringService, CandidateRepository],
})
export class HrScoringModule { }
