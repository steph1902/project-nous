import { Injectable } from '@nestjs/common';
import { WorkflowService } from '../../domain/services/workflow.service';
import { WorkflowRepository } from '../../infrastructure/persistence/workflow.repository';

export interface CreateWorkflowCommand {
    orgId: string;
    name: string;
    description?: string;
    createdBy: string;
}

export interface CreateWorkflowResult {
    workflowId: string;
    name: string;
}

@Injectable()
export class CreateWorkflowUseCase {
    constructor(
        private readonly workflowService: WorkflowService,
        private readonly workflowRepository: WorkflowRepository
    ) { }

    async execute(command: CreateWorkflowCommand): Promise<CreateWorkflowResult> {
        // Create workflow entity
        const workflow = this.workflowService.createWorkflow({
            orgId: command.orgId,
            name: command.name,
            description: command.description,
            createdBy: command.createdBy,
        });

        // Persist
        await this.workflowRepository.save(workflow);

        return {
            workflowId: workflow.id,
            name: workflow.name,
        };
    }
}
