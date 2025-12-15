import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { HrScoreEntity } from '../../domain/entities/score.entity';
import { HrScoreOutput, CandidateRanking } from '@nous/shared';

@Injectable()
export class ScoreRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<HrScoreEntity | null> {
        const score = await this.prisma.hrScore.findUnique({
            where: { id },
        });

        if (!score) return null;

        return new HrScoreEntity(
            score.id,
            score.submissionId,
            score.rubricVersion,
            score.modelId,
            score.scoreJson as unknown as HrScoreOutput,
            score.createdAt
        );
    }

    async findBySubmissionId(submissionId: string): Promise<HrScoreEntity | null> {
        const score = await this.prisma.hrScore.findFirst({
            where: { submissionId },
            orderBy: { createdAt: 'desc' },
        });

        if (!score) return null;

        return new HrScoreEntity(
            score.id,
            score.submissionId,
            score.rubricVersion,
            score.modelId,
            score.scoreJson as unknown as HrScoreOutput,
            score.createdAt
        );
    }

    async getCandidateRankings(
        orgId: string,
        limit: number = 50
    ): Promise<CandidateRanking[]> {
        const results = await this.prisma.$queryRaw<
            Array<{
                candidate_id: string;
                name: string;
                overall_score: number;
                categories: any;
                submitted_at: Date;
                has_red_flags: boolean;
            }>
        >`
      SELECT 
        c.id as candidate_id,
        c.name,
        (s.score_json->>'overall')::numeric as overall_score,
        s.score_json->'categories' as categories,
        sub.created_at as submitted_at,
        jsonb_array_length(s.score_json->'redFlags') > 0 as has_red_flags
      FROM hr_candidates c
      JOIN hr_submissions sub ON sub.candidate_id = c.id
      JOIN hr_scores s ON s.submission_id = sub.id
      WHERE c.org_id = ${orgId}
      ORDER BY overall_score DESC
      LIMIT ${limit}
    `;

        return results.map((r) => ({
            candidateId: r.candidate_id,
            name: r.name,
            overallScore: Number(r.overall_score),
            categories: r.categories || {},
            submittedAt: r.submitted_at.toISOString(),
            hasRedFlags: r.has_red_flags,
        }));
    }

    async save(score: HrScoreEntity): Promise<void> {
        await this.prisma.hrScore.create({
            data: {
                id: score.id,
                submissionId: score.submissionId,
                rubricVersion: score.rubricVersion,
                modelId: score.modelId,
                scoreJson: score.scoreJson as any,
                createdAt: score.createdAt,
            },
        });
    }
}
