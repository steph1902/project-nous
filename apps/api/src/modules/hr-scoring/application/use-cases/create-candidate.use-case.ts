import { Injectable } from '@nestjs/common';
import { HrScoringService } from '../../domain/services/hr-scoring.service';
import { CandidateRepository } from '../../infrastructure/persistence/candidate.repository';

export interface CreateCandidateCommand {
    orgId: string;
    name: string;
    email: string;
    meta?: Record<string, unknown>;
}

export interface CreateCandidateResult {
    candidateId: string;
    name: string;
}

@Injectable()
export class CreateCandidateUseCase {
    constructor(
        private readonly hrScoringService: HrScoringService,
        private readonly candidateRepository: CandidateRepository
    ) { }

    async execute(command: CreateCandidateCommand): Promise<CreateCandidateResult> {
        const candidate = this.hrScoringService.createCandidate({
            orgId: command.orgId,
            name: command.name,
            email: command.email,
            meta: command.meta,
        });

        await this.candidateRepository.save(candidate);

        return {
            candidateId: candidate.id,
            name: candidate.name,
        };
    }
}
