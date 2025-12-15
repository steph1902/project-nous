import { Module } from '@nestjs/common';
import { ToolGatewayService } from './domain/services/tool-gateway.service';
import { ExecuteToolUseCase } from './application/use-cases/execute-tool.use-case';
import { RegisterIntegrationUseCase } from './application/use-cases/register-integration.use-case';
import { IntegrationRepository } from './infrastructure/persistence/integration.repository';
import { SecretRepository } from './infrastructure/persistence/secret.repository';
import { IntegrationsController } from './infrastructure/controllers/integrations.controller';
import { HttpToolAdapter } from './infrastructure/adapters/http.adapter';
import { SlackToolAdapter } from './infrastructure/adapters/slack.adapter';

@Module({
    controllers: [IntegrationsController],
    providers: [
        // Domain Services
        ToolGatewayService,

        // Use Cases
        ExecuteToolUseCase,
        RegisterIntegrationUseCase,

        // Repositories
        IntegrationRepository,
        SecretRepository,

        // Adapters
        HttpToolAdapter,
        SlackToolAdapter,
    ],
    exports: [ToolGatewayService, IntegrationRepository],
})
export class ToolIntegrationsModule { }
