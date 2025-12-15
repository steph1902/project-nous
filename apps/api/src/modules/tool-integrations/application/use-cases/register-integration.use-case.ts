import { Injectable } from '@nestjs/common';
import { ToolGatewayService } from '../../domain/services/tool-gateway.service';
import { IntegrationRepository } from '../../infrastructure/persistence/integration.repository';
import { SecretRepository } from '../../infrastructure/persistence/secret.repository';
import { ConfigService } from '@nestjs/config';
import { IntegrationType } from '../../domain/entities/integration.entity';

export interface RegisterIntegrationCommand {
    orgId: string;
    name: string;
    type: IntegrationType;
    configJson: Record<string, unknown>;
    permissions?: string[];
    secrets?: Array<{ key: string; value: string }>;
}

export interface RegisterIntegrationResult {
    integrationId: string;
    name: string;
    type: IntegrationType;
}

@Injectable()
export class RegisterIntegrationUseCase {
    constructor(
        private readonly toolGateway: ToolGatewayService,
        private readonly integrationRepository: IntegrationRepository,
        private readonly secretRepository: SecretRepository,
        private readonly config: ConfigService
    ) { }

    async execute(command: RegisterIntegrationCommand): Promise<RegisterIntegrationResult> {
        // Create integration
        const integration = this.toolGateway.createIntegration({
            orgId: command.orgId,
            name: command.name,
            type: command.type,
            configJson: command.configJson,
            permissions: command.permissions,
        });

        // Save integration
        await this.integrationRepository.save(integration);

        // Save secrets if provided
        if (command.secrets && command.secrets.length > 0) {
            const encryptionKey = this.config.get<string>('ENCRYPTION_KEY', 'default-key');

            for (const secretInput of command.secrets) {
                const secret = this.toolGateway.createSecret({
                    orgId: command.orgId,
                    integrationId: integration.id,
                    key: secretInput.key,
                    value: secretInput.value,
                    encryptionKey,
                });

                await this.secretRepository.save(secret);
            }
        }

        return {
            integrationId: integration.id,
            name: integration.name,
            type: integration.type,
        };
    }
}
