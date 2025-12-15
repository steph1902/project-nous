import { Injectable } from '@nestjs/common';
import { CandidateRepository } from '../../infrastructure/persistence/candidate.repository';
import { ScoreRepository } from '../../infrastructure/persistence/score.repository';
import { CandidateRanking } from '@nous/shared';

export interface GetCandidateRankingsQuery {
    orgId: string;
    limit?: number;
}

export interface GetCandidateRankingsResult {
    rankings: CandidateRanking[];
    total: number;
}

@Injectable()
export class GetCandidateRankingsUseCase {
    constructor(
        private readonly candidateRepository: CandidateRepository,
        private readonly scoreRepository: ScoreRepository
    ) { }

    async execute(query: GetCandidateRankingsQuery): Promise<GetCandidateRankingsResult> {
        const limit = query.limit || 50;

        const rankings = await this.scoreRepository.getCandidateRankings(
            query.orgId,
            limit
        );

        const total = await this.candidateRepository.countByOrgId(query.orgId);

        return { rankings, total };
    }
}
