import { Module } from '@nestjs/common';
import { WorkflowService } from './domain/services/workflow.service';
import { CreateWorkflowUseCase } from './application/use-cases/create-workflow.use-case';
import { PublishWorkflowVersionUseCase } from './application/use-cases/publish-workflow-version.use-case';
import { GetWorkflowUseCase } from './application/use-cases/get-workflow.use-case';
import { ListWorkflowsUseCase } from './application/use-cases/list-workflows.use-case';
import { WorkflowRepository } from './infrastructure/persistence/workflow.repository';
import { WorkflowVersionRepository } from './infrastructure/persistence/workflow-version.repository';
import { WorkflowsController } from './infrastructure/controllers/workflows.controller';

@Module({
    controllers: [WorkflowsController],
    providers: [
        // Domain Services
        WorkflowService,

        // Use Cases
        CreateWorkflowUseCase,
        PublishWorkflowVersionUseCase,
        GetWorkflowUseCase,
        ListWorkflowsUseCase,

        // Repositories
        WorkflowRepository,
        WorkflowVersionRepository,
    ],
    exports: [WorkflowService, WorkflowRepository, WorkflowVersionRepository],
})
export class WorkflowCatalogModule { }
