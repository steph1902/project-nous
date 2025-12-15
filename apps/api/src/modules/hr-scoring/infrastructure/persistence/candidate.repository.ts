import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { HrCandidateEntity } from '../../domain/entities/candidate.entity';

@Injectable()
export class CandidateRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<HrCandidateEntity | null> {
        const candidate = await this.prisma.hrCandidate.findUnique({
            where: { id },
        });

        if (!candidate) return null;

        return new HrCandidateEntity(
            candidate.id,
            candidate.orgId,
            candidate.name,
            candidate.emailHash,
            candidate.metaJson as Record<string, unknown>,
            candidate.createdAt
        );
    }

    async findByOrgId(orgId: string, limit: number = 50): Promise<HrCandidateEntity[]> {
        const candidates = await this.prisma.hrCandidate.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        return candidates.map(
            (c) =>
                new HrCandidateEntity(
                    c.id,
                    c.orgId,
                    c.name,
                    c.emailHash,
                    c.metaJson as Record<string, unknown>,
                    c.createdAt
                )
        );
    }

    async countByOrgId(orgId: string): Promise<number> {
        return this.prisma.hrCandidate.count({ where: { orgId } });
    }

    async save(candidate: HrCandidateEntity): Promise<void> {
        await this.prisma.hrCandidate.upsert({
            where: { id: candidate.id },
            create: {
                id: candidate.id,
                orgId: candidate.orgId,
                name: candidate.name,
                emailHash: candidate.emailHash,
                metaJson: candidate.meta,
                createdAt: candidate.createdAt,
            },
            update: {
                name: candidate.name,
                metaJson: candidate.meta,
            },
        });
    }
}
