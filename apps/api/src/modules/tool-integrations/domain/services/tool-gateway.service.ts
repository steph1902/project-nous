import { Injectable } from '@nestjs/common';
import { IntegrationEntity, IntegrationType } from '../entities/integration.entity';
import { SecretEntity } from '../entities/secret.entity';
import { generateIntegrationId } from '@nous/shared';

/**
 * Tool execution request
 */
export interface ToolRequest {
    integrationId: string;
    action: string;
    params: Record<string, unknown>;
    scope: string;
}

/**
 * Tool execution response
 */
export interface ToolResponse {
    success: boolean;
    data?: unknown;
    error?: string;
    durationMs: number;
}

/**
 * Tool Adapter interface - implement for each integration type
 */
export interface ToolAdapter {
    type: IntegrationType;
    execute(request: ToolRequest, config: Record<string, unknown>, secrets: Record<string, string>): Promise<ToolResponse>;
}

@Injectable()
export class ToolGatewayService {
    private adapters: Map<IntegrationType, ToolAdapter> = new Map();

    registerAdapter(adapter: ToolAdapter): void {
        this.adapters.set(adapter.type, adapter);
    }

    getAdapter(type: IntegrationType): ToolAdapter | undefined {
        return this.adapters.get(type);
    }

    createIntegration(input: {
        orgId: string;
        name: string;
        type: IntegrationType;
        configJson: Record<string, unknown>;
        permissions?: string[];
    }): IntegrationEntity {
        const id = generateIntegrationId();
        return IntegrationEntity.create({ ...input, id });
    }

    createSecret(input: {
        orgId: string;
        integrationId: string;
        key: string;
        value: string;
        encryptionKey: string;
    }): SecretEntity {
        const id = `sec_${Date.now()}`;
        return SecretEntity.create({ ...input, id });
    }

    validatePermission(integration: IntegrationEntity, scope: string): boolean {
        return integration.hasPermission(scope);
    }
}
