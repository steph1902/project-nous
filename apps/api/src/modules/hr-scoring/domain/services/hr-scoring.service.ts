import { Injectable } from '@nestjs/common';
import {
    HrCandidateEntity,
    CreateCandidateInput,
} from '../entities/candidate.entity';
import {
    HrSubmissionEntity,
    CreateSubmissionInput,
} from '../entities/submission.entity';
import { HrScoreEntity, CreateScoreInput } from '../entities/score.entity';
import { generateCandidateId, generateSubmissionId } from '@nous/shared';

@Injectable()
export class HrScoringService {
    createCandidate(input: CreateCandidateInput): HrCandidateEntity {
        const id = generateCandidateId();
        return HrCandidateEntity.create({ ...input, id });
    }

    createSubmission(input: CreateSubmissionInput): HrSubmissionEntity {
        const id = generateSubmissionId();
        return HrSubmissionEntity.create({ ...input, id });
    }

    createScore(input: CreateScoreInput): HrScoreEntity {
        const id = `score_${Date.now()}`;
        return HrScoreEntity.create({ ...input, id });
    }
}
