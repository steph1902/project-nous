/**
 * Domain-specific errors for Identity & Access context
 */

export class UserNotFoundError extends Error {
    constructor(userId: string) {
        super(`User not found: ${userId}`);
        this.name = 'UserNotFoundError';
    }
}

export class UserAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`User already exists with email: ${email}`);
        this.name = 'UserAlreadyExistsError';
    }
}

export class OrgNotFoundError extends Error {
    constructor(orgId: string) {
        super(`Organization not found: ${orgId}`);
        this.name = 'OrgNotFoundError';
    }
}

export class OrgMemberNotFoundError extends Error {
    constructor(orgId: string, userId: string) {
        super(`Member not found in organization: ${userId} in ${orgId}`);
        this.name = 'OrgMemberNotFoundError';
    }
}

export class InvalidApiKeyError extends Error {
    constructor() {
        super('Invalid or expired API key');
        this.name = 'InvalidApiKeyError';
    }
}

export class InsufficientPermissionError extends Error {
    constructor(requiredRole: string) {
        super(`Insufficient permission. Required role: ${requiredRole}`);
        this.name = 'InsufficientPermissionError';
    }
}
