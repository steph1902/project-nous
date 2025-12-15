import { Injectable } from '@nestjs/common';
import { WorkflowRepository } from '../../infrastructure/persistence/workflow.repository';
import { Workflow } from '../../domain/entities/workflow.entity';

export interface ListWorkflowsQuery {
    orgId: string;
    limit?: number;
    cursor?: string;
}

export interface ListWorkflowsResult {
    workflows: Workflow[];
    nextCursor?: string;
    total: number;
}

@Injectable()
export class ListWorkflowsUseCase {
    constructor(private readonly workflowRepository: WorkflowRepository) { }

    async execute(query: ListWorkflowsQuery): Promise<ListWorkflowsResult> {
        const limit = query.limit || 20;

        const workflows = await this.workflowRepository.findByOrgId(
            query.orgId,
            limit + 1,
            query.cursor
        );

        const hasMore = workflows.length > limit;
        const items = hasMore ? workflows.slice(0, limit) : workflows;

        const total = await this.workflowRepository.countByOrgId(query.orgId);

        return {
            workflows: items.map((w) => w.toObject()),
            nextCursor: hasMore ? items[items.length - 1].id : undefined,
            total,
        };
    }
}
