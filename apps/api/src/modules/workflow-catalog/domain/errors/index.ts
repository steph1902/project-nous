/**
 * Domain errors for Workflow Catalog context
 */

export class WorkflowNotFoundError extends Error {
    constructor(workflowId: string) {
        super(`Workflow not found: ${workflowId}`);
        this.name = 'WorkflowNotFoundError';
    }
}

export class WorkflowVersionNotFoundError extends Error {
    constructor(versionId: string) {
        super(`Workflow version not found: ${versionId}`);
        this.name = 'WorkflowVersionNotFoundError';
    }
}

export class WorkflowAccessDeniedError extends Error {
    constructor(workflowId: string, orgId: string) {
        super(`Access denied to workflow ${workflowId} for org ${orgId}`);
        this.name = 'WorkflowAccessDeniedError';
    }
}

export class WorkflowVersionConflictError extends Error {
    constructor(workflowId: string, version: number) {
        super(`Version ${version} already exists for workflow ${workflowId}`);
        this.name = 'WorkflowVersionConflictError';
    }
}

export class WorkflowPublishError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WorkflowPublishError';
    }
}
