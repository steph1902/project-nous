export interface ErrorDetails {
    code: string;
    message: string;
    requestId?: string;
    details?: Record<string, unknown>;
}
export declare abstract class AppError extends Error {
    abstract readonly code: string;
    abstract readonly statusCode: number;
    readonly details?: Record<string, unknown>;
    constructor(message: string, details?: Record<string, unknown>);
    toJSON(): ErrorDetails;
}
export declare class AuthRequiredError extends AppError {
    readonly code = "AUTH_REQUIRED";
    readonly statusCode = 401;
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    readonly code = "FORBIDDEN";
    readonly statusCode = 403;
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    readonly code = "NOT_FOUND";
    readonly statusCode = 404;
    constructor(resource: string, id?: string);
}
export declare class ValidationError extends AppError {
    readonly code = "VALIDATION_ERROR";
    readonly statusCode = 400;
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class RateLimitedError extends AppError {
    readonly code = "RATE_LIMITED";
    readonly statusCode = 429;
    constructor(message?: string, retryAfter?: number);
}
export declare class LlmProviderError extends AppError {
    readonly code = "LLM_PROVIDER_ERROR";
    readonly statusCode = 502;
    constructor(message: string, provider?: string);
}
export declare class LlmOutputInvalidError extends AppError {
    readonly code = "LLM_OUTPUT_INVALID";
    readonly statusCode = 422;
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class ToolScopeDeniedError extends AppError {
    readonly code = "TOOL_SCOPE_DENIED";
    readonly statusCode = 403;
    constructor(tool: string, scope: string);
}
export declare class IntegrationMisconfiguredError extends AppError {
    readonly code = "INTEGRATION_MISCONFIGURED";
    readonly statusCode = 400;
    constructor(integration: string, issue: string);
}
export declare class RunConflictError extends AppError {
    readonly code = "RUN_CONFLICT";
    readonly statusCode = 409;
    constructor(message: string, idempotencyKey?: string);
}
export declare class BudgetExceededError extends AppError {
    readonly code = "BUDGET_EXCEEDED";
    readonly statusCode = 402;
    constructor(budgetType: string, limit: number, current: number);
}
//# sourceMappingURL=errors.d.ts.map