import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import {
    WorkflowVersionEntity,
    WorkflowVersionStatus,
} from '../../domain/entities/workflow-version.entity';
import { WorkflowDag } from '@nous/shared';

@Injectable()
export class WorkflowVersionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<WorkflowVersionEntity | null> {
        const version = await this.prisma.workflowVersion.findUnique({
            where: { id },
        });

        if (!version) return null;

        return new WorkflowVersionEntity(
            version.id,
            version.workflowId,
            version.version,
            version.status as WorkflowVersionStatus,
            version.dagJson as unknown as WorkflowDag,
            version.createdBy,
            version.createdAt
        );
    }

    async findByWorkflowId(workflowId: string): Promise<WorkflowVersionEntity[]> {
        const versions = await this.prisma.workflowVersion.findMany({
            where: { workflowId },
            orderBy: { version: 'desc' },
        });

        return versions.map(
            (v) =>
                new WorkflowVersionEntity(
                    v.id,
                    v.workflowId,
                    v.version,
                    v.status as WorkflowVersionStatus,
                    v.dagJson as unknown as WorkflowDag,
                    v.createdBy,
                    v.createdAt
                )
        );
    }

    async findLatestVersion(
        workflowId: string
    ): Promise<WorkflowVersionEntity | null> {
        const version = await this.prisma.workflowVersion.findFirst({
            where: { workflowId },
            orderBy: { version: 'desc' },
        });

        if (!version) return null;

        return new WorkflowVersionEntity(
            version.id,
            version.workflowId,
            version.version,
            version.status as WorkflowVersionStatus,
            version.dagJson as unknown as WorkflowDag,
            version.createdBy,
            version.createdAt
        );
    }

    async findLatestPublished(
        workflowId: string
    ): Promise<WorkflowVersionEntity | null> {
        const version = await this.prisma.workflowVersion.findFirst({
            where: { workflowId, status: 'PUBLISHED' },
            orderBy: { version: 'desc' },
        });

        if (!version) return null;

        return new WorkflowVersionEntity(
            version.id,
            version.workflowId,
            version.version,
            version.status as WorkflowVersionStatus,
            version.dagJson as unknown as WorkflowDag,
            version.createdBy,
            version.createdAt
        );
    }

    async save(version: WorkflowVersionEntity): Promise<void> {
        await this.prisma.workflowVersion.upsert({
            where: { id: version.id },
            create: {
                id: version.id,
                workflowId: version.workflowId,
                version: version.version,
                status: version.status,
                dagJson: version.dagJson as any,
                createdBy: version.createdBy,
                createdAt: version.createdAt,
            },
            update: {
                status: version.status,
            },
        });
    }
}
