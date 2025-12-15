import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { WorkflowEntity } from '../../domain/entities/workflow.entity';

@Injectable()
export class WorkflowRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<WorkflowEntity | null> {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflow) return null;

        return new WorkflowEntity(
            workflow.id,
            workflow.orgId,
            workflow.name,
            workflow.description,
            workflow.createdBy,
            workflow.createdAt
        );
    }

    async findByOrgId(
        orgId: string,
        limit: number = 20,
        cursor?: string
    ): Promise<WorkflowEntity[]> {
        const workflows = await this.prisma.workflow.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1,
            }),
        });

        return workflows.map(
            (w) =>
                new WorkflowEntity(
                    w.id,
                    w.orgId,
                    w.name,
                    w.description,
                    w.createdBy,
                    w.createdAt
                )
        );
    }

    async countByOrgId(orgId: string): Promise<number> {
        return this.prisma.workflow.count({ where: { orgId } });
    }

    async save(workflow: WorkflowEntity): Promise<void> {
        await this.prisma.workflow.upsert({
            where: { id: workflow.id },
            create: {
                id: workflow.id,
                orgId: workflow.orgId,
                name: workflow.name,
                description: workflow.description,
                createdBy: workflow.createdBy,
                createdAt: workflow.createdAt,
            },
            update: {
                name: workflow.name,
                description: workflow.description,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.workflow.delete({ where: { id } });
    }
}
