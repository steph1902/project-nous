import { Injectable } from '@nestjs/common';
import { ToolGatewayService, ToolRequest, ToolResponse, ToolAdapter } from '../entities/../services/tool-gateway.service';
import { IntegrationRepository } from '../../infrastructure/persistence/integration.repository';
import { SecretRepository } from '../../infrastructure/persistence/secret.repository';
import { ConfigService } from '@nestjs/config';
import {
    IntegrationNotFoundError,
    IntegrationDisabledError,
    PermissionDeniedError,
    ToolExecutionError,
} from '../../domain/errors';

export interface ExecuteToolCommand {
    integrationId: string;
    orgId: string;
    action: string;
    params: Record<string, unknown>;
    scope: string;
}

@Injectable()
export class ExecuteToolUseCase {
    constructor(
        private readonly toolGateway: ToolGatewayService,
        private readonly integrationRepository: IntegrationRepository,
        private readonly secretRepository: SecretRepository,
        private readonly config: ConfigService
    ) { }

    async execute(command: ExecuteToolCommand): Promise<ToolResponse> {
        const startTime = Date.now();

        // Load integration
        const integration = await this.integrationRepository.findById(command.integrationId);
        if (!integration) {
            throw new IntegrationNotFoundError(command.integrationId);
        }

        // Verify org access
        if (integration.orgId !== command.orgId) {
            throw new IntegrationNotFoundError(command.integrationId);
        }

        // Check if enabled
        if (!integration.enabled) {
            throw new IntegrationDisabledError(command.integrationId);
        }

        // Check permission
        if (!this.toolGateway.validatePermission(integration, command.scope)) {
            throw new PermissionDeniedError(command.integrationId, command.scope);
        }

        // Get adapter
        const adapter = this.toolGateway.getAdapter(integration.type);
        if (!adapter) {
            throw new ToolExecutionError(`No adapter registered for type: ${integration.type}`);
        }

        // Load secrets
        const secrets = await this.secretRepository.findByIntegrationId(command.integrationId);
        const encryptionKey = this.config.get<string>('ENCRYPTION_KEY', 'default-key');

        const secretMap: Record<string, string> = {};
        for (const secret of secrets) {
            secretMap[secret.key] = secret.decrypt(encryptionKey);
        }

        // Execute tool
        try {
            const request: ToolRequest = {
                integrationId: command.integrationId,
                action: command.action,
                params: command.params,
                scope: command.scope,
            };

            const response = await adapter.execute(request, integration.configJson, secretMap);

            return {
                ...response,
                durationMs: Date.now() - startTime,
            };
        } catch (error) {
            throw new ToolExecutionError(
                `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error
            );
        }
    }
}
