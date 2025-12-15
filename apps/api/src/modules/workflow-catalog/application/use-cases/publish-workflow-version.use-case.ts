import { Injectable } from '@nestjs/common';
import { WorkflowDag } from '@nous/shared';
import { WorkflowService } from '../../domain/services/workflow.service';
import { WorkflowRepository } from '../../infrastructure/persistence/workflow.repository';
import { WorkflowVersionRepository } from '../../infrastructure/persistence/workflow-version.repository';
import {
    WorkflowNotFoundError,
    WorkflowAccessDeniedError,
} from '../../domain/errors';

export interface PublishWorkflowVersionCommand {
    workflowId: string;
    orgId: string;
    dagJson: WorkflowDag;
    createdBy: string;
}

export interface PublishWorkflowVersionResult {
    versionId: string;
    version: number;
    status: string;
    nodeCount: number;
}

@Injectable()
export class PublishWorkflowVersionUseCase {
    constructor(
        private readonly workflowService: WorkflowService,
        private readonly workflowRepository: WorkflowRepository,
        private readonly workflowVersionRepository: WorkflowVersionRepository
    ) { }

    async execute(
        command: PublishWorkflowVersionCommand
    ): Promise<PublishWorkflowVersionResult> {
        // Load workflow to verify ownership
        const workflow = await this.workflowRepository.findById(command.workflowId);
        if (!workflow) {
            throw new WorkflowNotFoundError(command.workflowId);
        }

        if (workflow.orgId !== command.orgId) {
            throw new WorkflowAccessDeniedError(command.workflowId, command.orgId);
        }

        // Get next version number
        const latestVersion = await this.workflowVersionRepository.findLatestVersion(
            command.workflowId
        );
        const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

        // Create version entity (validates DAG)
        const versionEntity = this.workflowService.createVersion({
            workflowId: command.workflowId,
            version: nextVersion,
            dagJson: command.dagJson,
            createdBy: command.createdBy,
        });

        // Publish immediately (or could be a separate step)
        const publishedVersion = this.workflowService.publishVersion(versionEntity);

        // Persist
        await this.workflowVersionRepository.save(publishedVersion);

        return {
            versionId: publishedVersion.id,
            version: publishedVersion.version,
            status: publishedVersion.status,
            nodeCount: publishedVersion.getNodeCount(),
        };
    }
}
