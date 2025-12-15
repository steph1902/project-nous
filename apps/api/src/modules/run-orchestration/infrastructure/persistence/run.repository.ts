import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { RunEntity } from '../../domain/entities/run.entity';
import { RunStatus } from '@nous/shared';

@Injectable()
export class RunRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<RunEntity | null> {
        const run = await this.prisma.run.findUnique({
            where: { id },
        });

        if (!run) return null;

        return new RunEntity(
            run.id,
            run.orgId,
            run.workflowVersionId,
            run.status as RunStatus,
            run.initiatedBy,
            run.inputJson as Record<string, unknown>,
            run.outputJson as Record<string, unknown> | null,
            run.startedAt,
            run.finishedAt
        );
    }

    async findByIdempotencyKey(
        orgId: string,
        key: string
    ): Promise<RunEntity | null> {
        const idempotency = await this.prisma.idempotencyKey.findUnique({
            where: { orgId_key: { orgId, key } },
        });

        if (!idempotency) return null;

        const response = idempotency.responseJson as { runId: string };
        return this.findById(response.runId);
    }

    async findByOrgId(
        orgId: string,
        limit: number = 20,
        cursor?: string
    ): Promise<RunEntity[]> {
        const runs = await this.prisma.run.findMany({
            where: { orgId },
            orderBy: { startedAt: 'desc' },
            take: limit,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1,
            }),
        });

        return runs.map(
            (r) =>
                new RunEntity(
                    r.id,
                    r.orgId,
                    r.workflowVersionId,
                    r.status as RunStatus,
                    r.initiatedBy,
                    r.inputJson as Record<string, unknown>,
                    r.outputJson as Record<string, unknown> | null,
                    r.startedAt,
                    r.finishedAt
                )
        );
    }

    async save(run: RunEntity, idempotencyKey?: string): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            await tx.run.upsert({
                where: { id: run.id },
                create: {
                    id: run.id,
                    orgId: run.orgId,
                    workflowVersionId: run.workflowVersionId,
                    status: run.status,
                    initiatedBy: run.initiatedBy,
                    inputJson: run.inputJson,
                    outputJson: run.outputJson,
                    startedAt: run.startedAt,
                    finishedAt: run.finishedAt,
                },
                update: {
                    status: run.status,
                    outputJson: run.outputJson,
                    finishedAt: run.finishedAt,
                },
            });

            if (idempotencyKey) {
                await tx.idempotencyKey.upsert({
                    where: { orgId_key: { orgId: run.orgId, key: idempotencyKey } },
                    create: {
                        orgId: run.orgId,
                        key: idempotencyKey,
                        requestHash: '', // Could add request hashing
                        responseJson: { runId: run.id },
                    },
                    update: {},
                });
            }
        });
    }

    async countByOrgId(orgId: string): Promise<number> {
        return this.prisma.run.count({ where: { orgId } });
    }
}
