import { Module } from '@nestjs/common';
import { RunService } from './domain/services/run.service';
import { StartRunUseCase } from './application/use-cases/start-run.use-case';
import { GetRunUseCase } from './application/use-cases/get-run.use-case';
import { CancelRunUseCase } from './application/use-cases/cancel-run.use-case';
import { RunRepository } from './infrastructure/persistence/run.repository';
import { RunNodeRepository } from './infrastructure/persistence/run-node.repository';
import { RunsController } from './infrastructure/controllers/runs.controller';
import { RunQueueService } from './infrastructure/queue/run-queue.service';
import { WorkflowCatalogModule } from '../workflow-catalog/workflow-catalog.module';

@Module({
    imports: [WorkflowCatalogModule],
    controllers: [RunsController],
    providers: [
        // Domain Services
        RunService,

        // Use Cases
        StartRunUseCase,
        GetRunUseCase,
        CancelRunUseCase,

        // Repositories
        RunRepository,
        RunNodeRepository,

        // Queue
        RunQueueService,
    ],
    exports: [RunService, RunRepository],
})
export class RunOrchestrationModule { }
