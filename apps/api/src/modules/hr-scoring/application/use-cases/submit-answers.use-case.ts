import { Injectable } from '@nestjs/common';
import { HrScoringService } from '../../domain/services/hr-scoring.service';
import { CandidateRepository } from '../../infrastructure/persistence/candidate.repository';
import { SubmissionRepository } from '../../infrastructure/persistence/submission.repository';
import { CandidateNotFoundError } from '../../domain/errors';

export interface SubmitAnswersCommand {
    candidateId: string;
    formVersion: string;
    answers: Record<string, string>;
}

export interface SubmitAnswersResult {
    submissionId: string;
    formVersion: string;
}

@Injectable()
export class SubmitAnswersUseCase {
    constructor(
        private readonly hrScoringService: HrScoringService,
        private readonly candidateRepository: CandidateRepository,
        private readonly submissionRepository: SubmissionRepository
    ) { }

    async execute(command: SubmitAnswersCommand): Promise<SubmitAnswersResult> {
        // Verify candidate exists
        const candidate = await this.candidateRepository.findById(command.candidateId);
        if (!candidate) {
            throw new CandidateNotFoundError(command.candidateId);
        }

        const submission = this.hrScoringService.createSubmission({
            candidateId: command.candidateId,
            formVersion: command.formVersion,
            answersJson: command.answers,
        });

        await this.submissionRepository.save(submission);

        return {
            submissionId: submission.id,
            formVersion: submission.formVersion,
        };
    }
}
