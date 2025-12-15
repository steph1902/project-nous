import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { RunNodeEntity } from '../../domain/entities/run-node.entity';
import { NodeStatus } from '@nous/shared';

@Injectable()
export class RunNodeRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<RunNodeEntity | null> {
        const node = await this.prisma.runNode.findUnique({
            where: { id },
        });

        if (!node) return null;

        return this.mapToEntity(node);
    }

    async findByRunId(runId: string): Promise<RunNodeEntity[]> {
        const nodes = await this.prisma.runNode.findMany({
            where: { runId },
            orderBy: { startedAt: 'asc' },
        });

        return nodes.map(this.mapToEntity);
    }

    async findByRunIdAndNodeKey(
        runId: string,
        nodeKey: string
    ): Promise<RunNodeEntity | null> {
        const node = await this.prisma.runNode.findUnique({
            where: { runId_nodeKey: { runId, nodeKey } },
        });

        if (!node) return null;

        return this.mapToEntity(node);
    }

    async save(node: RunNodeEntity): Promise<void> {
        await this.prisma.runNode.upsert({
            where: { id: node.id },
            create: {
                id: node.id,
                runId: node.runId,
                nodeKey: node.nodeKey,
                type: node.type,
                status: node.status,
                attempts: node.attempts,
                inputJson: node.inputJson,
                outputJson: node.outputJson,
                errorJson: node.errorJson,
                startedAt: node.startedAt,
                finishedAt: node.finishedAt,
            },
            update: {
                status: node.status,
                attempts: node.attempts,
                inputJson: node.inputJson,
                outputJson: node.outputJson,
                errorJson: node.errorJson,
                startedAt: node.startedAt,
                finishedAt: node.finishedAt,
            },
        });
    }

    private mapToEntity(node: any): RunNodeEntity {
        return new RunNodeEntity(
            node.id,
            node.runId,
            node.nodeKey,
            node.type,
            node.status as NodeStatus,
            node.attempts,
            node.inputJson as Record<string, unknown> | null,
            node.outputJson as Record<string, unknown> | null,
            node.errorJson as { code: string; message: string } | null,
            node.startedAt,
            node.finishedAt
        );
    }
}
