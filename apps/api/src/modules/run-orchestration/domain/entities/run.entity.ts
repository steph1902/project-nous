/**
 * Run Entity - Represents a single execution of a workflow
 */
import { RunStatus, canTransitionRun } from '@nous/shared';

export interface Run {
    id: string;
    orgId: string;
    workflowVersionId: string;
    status: RunStatus;
    initiatedBy: string;
    inputJson: Record<string, unknown>;
    outputJson: Record<string, unknown> | null;
    startedAt: Date;
    finishedAt: Date | null;
}

export interface CreateRunInput {
    orgId: string;
    workflowVersionId: string;
    initiatedBy: string;
    inputJson?: Record<string, unknown>;
}

export class RunEntity {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly workflowVersionId: string,
        public readonly status: RunStatus,
        public readonly initiatedBy: string,
        public readonly inputJson: Record<string, unknown>,
        public readonly outputJson: Record<string, unknown> | null,
        public readonly startedAt: Date,
        public readonly finishedAt: Date | null
    ) { }

    static create(input: CreateRunInput & { id: string }): RunEntity {
        return new RunEntity(
            input.id,
            input.orgId,
            input.workflowVersionId,
            'QUEUED',
            input.initiatedBy,
            input.inputJson || {},
            null,
            new Date(),
            null
        );
    }

    transitionTo(newStatus: RunStatus): RunEntity {
        if (!canTransitionRun(this.status, newStatus)) {
            throw new InvalidRunStateTransitionError(this.status, newStatus);
        }

        const finishedAt =
            ['SUCCEEDED', 'FAILED', 'CANCELED'].includes(newStatus)
                ? new Date()
                : this.finishedAt;

        return new RunEntity(
            this.id,
            this.orgId,
            this.workflowVersionId,
            newStatus,
            this.initiatedBy,
            this.inputJson,
            this.outputJson,
            this.startedAt,
            finishedAt
        );
    }

    start(): RunEntity {
        return this.transitionTo('RUNNING');
    }

    succeed(output: Record<string, unknown>): RunEntity {
        const transitioned = this.transitionTo('SUCCEEDED');
        return new RunEntity(
            transitioned.id,
            transitioned.orgId,
            transitioned.workflowVersionId,
            transitioned.status,
            transitioned.initiatedBy,
            transitioned.inputJson,
            output,
            transitioned.startedAt,
            transitioned.finishedAt
        );
    }

    fail(): RunEntity {
        return this.transitionTo('FAILED');
    }

    cancel(): RunEntity {
        return this.transitionTo('CANCELED');
    }

    isTerminal(): boolean {
        return ['SUCCEEDED', 'FAILED', 'CANCELED'].includes(this.status);
    }

    getDurationMs(): number | null {
        if (!this.finishedAt) return null;
        return this.finishedAt.getTime() - this.startedAt.getTime();
    }

    toObject(): Run {
        return {
            id: this.id,
            orgId: this.orgId,
            workflowVersionId: this.workflowVersionId,
            status: this.status,
            initiatedBy: this.initiatedBy,
            inputJson: this.inputJson,
            outputJson: this.outputJson,
            startedAt: this.startedAt,
            finishedAt: this.finishedAt,
        };
    }
}

export class InvalidRunStateTransitionError extends Error {
    constructor(from: RunStatus, to: RunStatus) {
        super(`Invalid run state transition: ${from} -> ${to}`);
        this.name = 'InvalidRunStateTransitionError';
    }
}
