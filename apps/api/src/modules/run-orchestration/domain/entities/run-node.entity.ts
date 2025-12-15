/**
 * RunNode Entity - Represents execution of a single node within a run
 */
import { NodeStatus, canTransitionNode } from '@nous/shared';

export interface RunNode {
    id: string;
    runId: string;
    nodeKey: string;
    type: string;
    status: NodeStatus;
    attempts: number;
    inputJson: Record<string, unknown> | null;
    outputJson: Record<string, unknown> | null;
    errorJson: { code: string; message: string } | null;
    startedAt: Date | null;
    finishedAt: Date | null;
}

export interface CreateRunNodeInput {
    runId: string;
    nodeKey: string;
    type: string;
}

export class RunNodeEntity {
    constructor(
        public readonly id: string,
        public readonly runId: string,
        public readonly nodeKey: string,
        public readonly type: string,
        public readonly status: NodeStatus,
        public readonly attempts: number,
        public readonly inputJson: Record<string, unknown> | null,
        public readonly outputJson: Record<string, unknown> | null,
        public readonly errorJson: { code: string; message: string } | null,
        public readonly startedAt: Date | null,
        public readonly finishedAt: Date | null
    ) { }

    static create(input: CreateRunNodeInput & { id: string }): RunNodeEntity {
        return new RunNodeEntity(
            input.id,
            input.runId,
            input.nodeKey,
            input.type,
            'QUEUED',
            0,
            null,
            null,
            null,
            null,
            null
        );
    }

    start(input: Record<string, unknown>): RunNodeEntity {
        if (!canTransitionNode(this.status, 'RUNNING')) {
            throw new InvalidNodeStateTransitionError(this.status, 'RUNNING');
        }

        return new RunNodeEntity(
            this.id,
            this.runId,
            this.nodeKey,
            this.type,
            'RUNNING',
            this.attempts + 1,
            input,
            this.outputJson,
            this.errorJson,
            new Date(),
            this.finishedAt
        );
    }

    succeed(output: Record<string, unknown>): RunNodeEntity {
        if (!canTransitionNode(this.status, 'SUCCEEDED')) {
            throw new InvalidNodeStateTransitionError(this.status, 'SUCCEEDED');
        }

        return new RunNodeEntity(
            this.id,
            this.runId,
            this.nodeKey,
            this.type,
            'SUCCEEDED',
            this.attempts,
            this.inputJson,
            output,
            null,
            this.startedAt,
            new Date()
        );
    }

    fail(error: { code: string; message: string }): RunNodeEntity {
        if (!canTransitionNode(this.status, 'FAILED')) {
            throw new InvalidNodeStateTransitionError(this.status, 'FAILED');
        }

        return new RunNodeEntity(
            this.id,
            this.runId,
            this.nodeKey,
            this.type,
            'FAILED',
            this.attempts,
            this.inputJson,
            this.outputJson,
            error,
            this.startedAt,
            new Date()
        );
    }

    skip(): RunNodeEntity {
        if (!canTransitionNode(this.status, 'SKIPPED')) {
            throw new InvalidNodeStateTransitionError(this.status, 'SKIPPED');
        }

        return new RunNodeEntity(
            this.id,
            this.runId,
            this.nodeKey,
            this.type,
            'SKIPPED',
            this.attempts,
            this.inputJson,
            this.outputJson,
            this.errorJson,
            this.startedAt,
            new Date()
        );
    }

    canRetry(maxAttempts: number): boolean {
        return this.status === 'FAILED' && this.attempts < maxAttempts;
    }

    resetForRetry(): RunNodeEntity {
        return new RunNodeEntity(
            this.id,
            this.runId,
            this.nodeKey,
            this.type,
            'QUEUED',
            this.attempts,
            null,
            null,
            null,
            null,
            null
        );
    }

    getDurationMs(): number | null {
        if (!this.startedAt || !this.finishedAt) return null;
        return this.finishedAt.getTime() - this.startedAt.getTime();
    }

    toObject(): RunNode {
        return {
            id: this.id,
            runId: this.runId,
            nodeKey: this.nodeKey,
            type: this.type,
            status: this.status,
            attempts: this.attempts,
            inputJson: this.inputJson,
            outputJson: this.outputJson,
            errorJson: this.errorJson,
            startedAt: this.startedAt,
            finishedAt: this.finishedAt,
        };
    }
}

export class InvalidNodeStateTransitionError extends Error {
    constructor(from: NodeStatus, to: NodeStatus) {
        super(`Invalid node state transition: ${from} -> ${to}`);
        this.name = 'InvalidNodeStateTransitionError';
    }
}
