/**
 * Domain errors for Tool Integrations context
 */

export class IntegrationNotFoundError extends Error {
    constructor(integrationId: string) {
        super(`Integration not found: ${integrationId}`);
        this.name = 'IntegrationNotFoundError';
    }
}

export class IntegrationDisabledError extends Error {
    constructor(integrationId: string) {
        super(`Integration is disabled: ${integrationId}`);
        this.name = 'IntegrationDisabledError';
    }
}

export class PermissionDeniedError extends Error {
    constructor(integrationId: string, scope: string) {
        super(`Permission denied for integration ${integrationId}: ${scope}`);
        this.name = 'PermissionDeniedError';
    }
}

export class ToolExecutionError extends Error {
    constructor(message: string, public readonly details?: unknown) {
        super(message);
        this.name = 'ToolExecutionError';
    }
}

export class SecretNotFoundError extends Error {
    constructor(key: string) {
        super(`Secret not found: ${key}`);
        this.name = 'SecretNotFoundError';
    }
}
