/**
 * User Entity - Core domain entity for user identity
 * 
 * Invariants:
 * - Email must be valid format
 * - User must have a unique ID
 */
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    lastLoginAt: Date | null;
}

export interface CreateUserInput {
    email: string;
    name: string;
}

export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly name: string,
        public readonly createdAt: Date,
        public readonly lastLoginAt: Date | null
    ) { }

    static create(input: CreateUserInput & { id: string }): UserEntity {
        return new UserEntity(
            input.id,
            input.email.toLowerCase().trim(),
            input.name.trim(),
            new Date(),
            null
        );
    }

    updateLastLogin(): UserEntity {
        return new UserEntity(
            this.id,
            this.email,
            this.name,
            this.createdAt,
            new Date()
        );
    }

    toObject(): User {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt,
        };
    }
}
