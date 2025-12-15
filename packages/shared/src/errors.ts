/**
 * Shared error types for consistent error handling across the application
 */

export interface ErrorDetails {
    code: string;
    message: string;
    requestId?: string;
    details?: Record<string, unknown>;
}

export abstract class AppError extends Error {
    abstract readonly code: string;
    abstract readonly statusCode: number;
    readonly details?: Record<string, unknown>;

    constructor(message: string, details?: Record<string, unknown>) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
    }

    toJSON(): ErrorDetails {
        return {
            code: this.code,
            message: this.message,
            details: this.details,
        };
    }
}

// Authentication Errors
export class AuthRequiredError extends AppError {
    readonly code = 'AUTH_REQUIRED';
    readonly statusCode = 401;

    constructor(message = 'Authentication required') {
        super(message);
    }
}

export class ForbiddenError extends AppError {
    readonly code = 'FORBIDDEN';
    readonly statusCode = 403;

    constructor(message = 'Access denied') {
        super(message);
    }
}

// Resource Errors
export class NotFoundError extends AppError {
    readonly code = 'NOT_FOUND';
    readonly statusCode = 404;

    constructor(resource: string, id?: string) {
        super(id ? `${resource} not found: ${id}` : `${resource} not found`);
    }
}

// Validation Errors
export class ValidationError extends AppError {
    readonly code = 'VALIDATION_ERROR';
    readonly statusCode = 400;

    constructor(message: string, details?: Record<string, unknown>) {
        super(message, details);
    }
}

// Rate Limiting
export class RateLimitedError extends AppError {
    readonly code = 'RATE_LIMITED';
    readonly statusCode = 429;

    constructor(message = 'Rate limit exceeded', retryAfter?: number) {
        super(message, retryAfter ? { retryAfter } : undefined);
    }
}

// LLM Errors
export class LlmProviderError extends AppError {
    readonly code = 'LLM_PROVIDER_ERROR';
    readonly statusCode = 502;

    constructor(message: string, provider?: string) {
        super(message, provider ? { provider } : undefined);
    }
}

export class LlmOutputInvalidError extends AppError {
    readonly code = 'LLM_OUTPUT_INVALID';
    readonly statusCode = 422;

    constructor(message: string, details?: Record<string, unknown>) {
        super(message, details);
    }
}

// Tool Errors
export class ToolScopeDeniedError extends AppError {
    readonly code = 'TOOL_SCOPE_DENIED';
    readonly statusCode = 403;

    constructor(tool: string, scope: string) {
        super(`Tool scope denied: ${tool} - ${scope}`, { tool, scope });
    }
}

export class IntegrationMisconfiguredError extends AppError {
    readonly code = 'INTEGRATION_MISCONFIGURED';
    readonly statusCode = 400;

    constructor(integration: string, issue: string) {
        super(`Integration misconfigured: ${integration} - ${issue}`, {
            integration,
            issue,
        });
    }
}

// Run Errors
export class RunConflictError extends AppError {
    readonly code = 'RUN_CONFLICT';
    readonly statusCode = 409;

    constructor(message: string, idempotencyKey?: string) {
        super(message, idempotencyKey ? { idempotencyKey } : undefined);
    }
}

// Budget Errors
export class BudgetExceededError extends AppError {
    readonly code = 'BUDGET_EXCEEDED';
    readonly statusCode = 402;

    constructor(budgetType: string, limit: number, current: number) {
        super(`Budget exceeded: ${budgetType}`, { budgetType, limit, current });
    }
}
