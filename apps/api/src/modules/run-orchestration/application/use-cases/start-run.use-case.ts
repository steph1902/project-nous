import { Injectable } from '@nestjs/common';
import { topologicalSort } from '@nous/shared';
import { RunService } from '../../domain/services/run.service';
import { RunRepository } from '../../infrastructure/persistence/run.repository';
import { RunNodeRepository } from '../../infrastructure/persistence/run-node.repository';
import { RunQueueService } from '../../infrastructure/queue/run-queue.service';
import { WorkflowVersionRepository } from '@/modules/workflow-catalog/infrastructure/persistence/workflow-version.repository';
import { WorkflowVersionNotFoundError } from '@/modules/workflow-catalog/domain/errors';

export interface StartRunCommand {
    workflowId: string;
    orgId: string;
    initiatedBy: string;
    input?: Record<string, unknown>;
    idempotencyKey?: string;
}

export interface StartRunResult {
    runId: string;
    status: string;
    nodeCount: number;
}

@Injectable()
export class StartRunUseCase {
    constructor(
        private readonly runService: RunService,
        private readonly runRepository: RunRepository,
        private readonly runNodeRepository: RunNodeRepository,
        private readonly workflowVersionRepository: WorkflowVersionRepository,
        private readonly runQueueService: RunQueueService
    ) { }

    async execute(command: StartRunCommand): Promise<StartRunResult> {
        // Check idempotency
        if (command.idempotencyKey) {
            const existing = await this.runRepository.findByIdempotencyKey(
                command.orgId,
                command.idempotencyKey
            );
            if (existing) {
                return {
                    runId: existing.id,
                    status: existing.status,
                    nodeCount: 0, // Already created
                };
            }
        }

        // Get latest published workflow version
        const workflowVersion =
            await this.workflowVersionRepository.findLatestPublished(command.workflowId);

        if (!workflowVersion) {
            throw new WorkflowVersionNotFoundError(
                `No published version for workflow: ${command.workflowId}`
            );
        }

        // Create run entity
        const run = this.runService.createRun({
            orgId: command.orgId,
            workflowVersionId: workflowVersion.id,
            initiatedBy: command.initiatedBy,
            inputJson: command.input,
        });

        // Create run nodes for each DAG node
        const dag = workflowVersion.dagJson;
        const executionOrder = topologicalSort(dag);

        const runNodes = executionOrder.map((nodeKey) => {
            const dagNode = dag.nodes.find((n) => n.key === nodeKey)!;
            return this.runService.createRunNode({
                runId: run.id,
                nodeKey,
                type: dagNode.type,
            });
        });

        // Persist run and nodes
        await this.runRepository.save(run, command.idempotencyKey);
        for (const node of runNodes) {
            await this.runNodeRepository.save(node);
        }

        // Enqueue for execution
        await this.runQueueService.enqueue({
            runId: run.id,
            orgId: run.orgId,
            workflowVersionId: run.workflowVersionId,
            input: run.inputJson,
        });

        return {
            runId: run.id,
            status: run.status,
            nodeCount: runNodes.length,
        };
    }
}
