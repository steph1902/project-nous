/**
 * Integration Entity - External tool/service connection
 */

export type IntegrationType = 'HTTP' | 'SLACK' | 'GMAIL' | 'SHEETS' | 'CUSTOM';

export interface Integration {
    id: string;
    orgId: string;
    name: string;
    type: IntegrationType;
    configJson: Record<string, unknown>;
    permissions: string[];
    enabled: boolean;
    createdAt: Date;
}

export interface CreateIntegrationInput {
    orgId: string;
    name: string;
    type: IntegrationType;
    configJson: Record<string, unknown>;
    permissions?: string[];
}

export class IntegrationEntity {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly name: string,
        public readonly type: IntegrationType,
        public readonly configJson: Record<string, unknown>,
        public readonly permissions: string[],
        public readonly enabled: boolean,
        public readonly createdAt: Date
    ) { }

    static create(input: CreateIntegrationInput & { id: string }): IntegrationEntity {
        if (!input.name || input.name.trim().length === 0) {
            throw new Error('Integration name cannot be empty');
        }

        return new IntegrationEntity(
            input.id,
            input.orgId,
            input.name.trim(),
            input.type,
            input.configJson,
            input.permissions || [],
            true,
            new Date()
        );
    }

    disable(): IntegrationEntity {
        return new IntegrationEntity(
            this.id,
            this.orgId,
            this.name,
            this.type,
            this.configJson,
            this.permissions,
            false,
            this.createdAt
        );
    }

    enable(): IntegrationEntity {
        return new IntegrationEntity(
            this.id,
            this.orgId,
            this.name,
            this.type,
            this.configJson,
            this.permissions,
            true,
            this.createdAt
        );
    }

    hasPermission(scope: string): boolean {
        return this.permissions.includes(scope) || this.permissions.includes('*');
    }

    toObject(): Integration {
        return {
            id: this.id,
            orgId: this.orgId,
            name: this.name,
            type: this.type,
            configJson: this.configJson,
            permissions: this.permissions,
            enabled: this.enabled,
            createdAt: this.createdAt,
        };
    }
}
