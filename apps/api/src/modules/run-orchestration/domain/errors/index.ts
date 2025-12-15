/**
 * Domain errors for Run Orchestration context
 */

export class RunNotFoundError extends Error {
    constructor(runId: string) {
        super(`Run not found: ${runId}`);
        this.name = 'RunNotFoundError';
    }
}

export class RunAccessDeniedError extends Error {
    constructor(runId: string, orgId: string) {
        super(`Access denied to run ${runId} for org ${orgId}`);
        this.name = 'RunAccessDeniedError';
    }
}

export class RunAlreadyTerminalError extends Error {
    constructor(runId: string, status: string) {
        super(`Run ${runId} is already in terminal state: ${status}`);
        this.name = 'RunAlreadyTerminalError';
    }
}

export class IdempotencyConflictError extends Error {
    constructor(key: string) {
        super(`Idempotency conflict for key: ${key}`);
        this.name = 'IdempotencyConflictError';
    }
}
