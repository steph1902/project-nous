"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetExceededError = exports.RunConflictError = exports.IntegrationMisconfiguredError = exports.ToolScopeDeniedError = exports.LlmOutputInvalidError = exports.LlmProviderError = exports.RateLimitedError = exports.ValidationError = exports.NotFoundError = exports.ForbiddenError = exports.AuthRequiredError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, details) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            details: this.details,
        };
    }
}
exports.AppError = AppError;
class AuthRequiredError extends AppError {
    constructor(message = 'Authentication required') {
        super(message);
        this.code = 'AUTH_REQUIRED';
        this.statusCode = 401;
    }
}
exports.AuthRequiredError = AuthRequiredError;
class ForbiddenError extends AppError {
    constructor(message = 'Access denied') {
        super(message);
        this.code = 'FORBIDDEN';
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(resource, id) {
        super(id ? `${resource} not found: ${id}` : `${resource} not found`);
        this.code = 'NOT_FOUND';
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message, details) {
        super(message, details);
        this.code = 'VALIDATION_ERROR';
        this.statusCode = 400;
    }
}
exports.ValidationError = ValidationError;
class RateLimitedError extends AppError {
    constructor(message = 'Rate limit exceeded', retryAfter) {
        super(message, retryAfter ? { retryAfter } : undefined);
        this.code = 'RATE_LIMITED';
        this.statusCode = 429;
    }
}
exports.RateLimitedError = RateLimitedError;
class LlmProviderError extends AppError {
    constructor(message, provider) {
        super(message, provider ? { provider } : undefined);
        this.code = 'LLM_PROVIDER_ERROR';
        this.statusCode = 502;
    }
}
exports.LlmProviderError = LlmProviderError;
class LlmOutputInvalidError extends AppError {
    constructor(message, details) {
        super(message, details);
        this.code = 'LLM_OUTPUT_INVALID';
        this.statusCode = 422;
    }
}
exports.LlmOutputInvalidError = LlmOutputInvalidError;
class ToolScopeDeniedError extends AppError {
    constructor(tool, scope) {
        super(`Tool scope denied: ${tool} - ${scope}`, { tool, scope });
        this.code = 'TOOL_SCOPE_DENIED';
        this.statusCode = 403;
    }
}
exports.ToolScopeDeniedError = ToolScopeDeniedError;
class IntegrationMisconfiguredError extends AppError {
    constructor(integration, issue) {
        super(`Integration misconfigured: ${integration} - ${issue}`, {
            integration,
            issue,
        });
        this.code = 'INTEGRATION_MISCONFIGURED';
        this.statusCode = 400;
    }
}
exports.IntegrationMisconfiguredError = IntegrationMisconfiguredError;
class RunConflictError extends AppError {
    constructor(message, idempotencyKey) {
        super(message, idempotencyKey ? { idempotencyKey } : undefined);
        this.code = 'RUN_CONFLICT';
        this.statusCode = 409;
    }
}
exports.RunConflictError = RunConflictError;
class BudgetExceededError extends AppError {
    constructor(budgetType, limit, current) {
        super(`Budget exceeded: ${budgetType}`, { budgetType, limit, current });
        this.code = 'BUDGET_EXCEEDED';
        this.statusCode = 402;
    }
}
exports.BudgetExceededError = BudgetExceededError;
//# sourceMappingURL=errors.js.map