import { Injectable } from '@nestjs/common';
import { WorkflowRepository } from '../../infrastructure/persistence/workflow.repository';
import { WorkflowVersionRepository } from '../../infrastructure/persistence/workflow-version.repository';
import { WorkflowNotFoundError, WorkflowAccessDeniedError } from '../../domain/errors';
import { Workflow } from '../../domain/entities/workflow.entity';
import { WorkflowVersion } from '../../domain/entities/workflow-version.entity';

export interface GetWorkflowQuery {
    workflowId: string;
    orgId: string;
    includeVersions?: boolean;
}

export interface GetWorkflowResult {
    workflow: Workflow;
    versions?: WorkflowVersion[];
    latestVersion?: WorkflowVersion;
}

@Injectable()
export class GetWorkflowUseCase {
    constructor(
        private readonly workflowRepository: WorkflowRepository,
        private readonly workflowVersionRepository: WorkflowVersionRepository
    ) { }

    async execute(query: GetWorkflowQuery): Promise<GetWorkflowResult> {
        const workflow = await this.workflowRepository.findById(query.workflowId);

        if (!workflow) {
            throw new WorkflowNotFoundError(query.workflowId);
        }

        if (workflow.orgId !== query.orgId) {
            throw new WorkflowAccessDeniedError(query.workflowId, query.orgId);
        }

        const result: GetWorkflowResult = {
            workflow: workflow.toObject(),
        };

        if (query.includeVersions) {
            const versions = await this.workflowVersionRepository.findByWorkflowId(
                query.workflowId
            );
            result.versions = versions.map((v) => v.toObject());
        }

        const latestVersion = await this.workflowVersionRepository.findLatestVersion(
            query.workflowId
        );
        if (latestVersion) {
            result.latestVersion = latestVersion.toObject();
        }

        return result;
    }
}
