import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterIntegrationUseCase } from '../../application/use-cases/register-integration.use-case';
import { ExecuteToolUseCase } from '../../application/use-cases/execute-tool.use-case';
import { IntegrationRepository } from '../persistence/integration.repository';
import { JwtAuthGuard } from '@/modules/identity-access/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '@/modules/identity-access/infrastructure/auth/roles.guard';
import { CurrentUser } from '@/modules/identity-access/infrastructure/auth/current-user.decorator';
import { Roles } from '@/modules/identity-access/infrastructure/auth/roles.decorator';
import { Role } from '@/modules/identity-access/domain/value-objects/role.value-object';
import { AuthUser } from '@/modules/identity-access/infrastructure/auth/jwt.strategy';
import { IntegrationType } from '../../domain/entities/integration.entity';
import {
    IntegrationNotFoundError,
    IntegrationDisabledError,
    PermissionDeniedError,
} from '../../domain/errors';

// DTOs
class RegisterIntegrationDto {
    name!: string;
    type!: IntegrationType;
    configJson!: Record<string, unknown>;
    permissions?: string[];
    secrets?: Array<{ key: string; value: string }>;
}

class ExecuteToolDto {
    action!: string;
    params!: Record<string, unknown>;
    scope!: string;
}

@ApiTags('Integrations')
@Controller('integrations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class IntegrationsController {
    constructor(
        private readonly registerIntegration: RegisterIntegrationUseCase,
        private readonly executeTool: ExecuteToolUseCase,
        private readonly integrationRepository: IntegrationRepository
    ) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Register a new integration' })
    async register(@Body() dto: RegisterIntegrationDto, @CurrentUser() user: AuthUser) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.registerIntegration.execute({
            orgId: user.orgId,
            name: dto.name,
            type: dto.type,
            configJson: dto.configJson,
            permissions: dto.permissions,
            secrets: dto.secrets,
        });

        return result;
    }

    @Get()
    @ApiOperation({ summary: 'List integrations' })
    async list(@CurrentUser() user: AuthUser) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const integrations = await this.integrationRepository.findByOrgId(user.orgId);
        return { integrations: integrations.map((i) => i.toObject()) };
    }

    @Post(':integrationId/execute')
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Execute a tool action' })
    async execute(
        @Param('integrationId') integrationId: string,
        @Body() dto: ExecuteToolDto,
        @CurrentUser() user: AuthUser
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        try {
            const result = await this.executeTool.execute({
                integrationId,
                orgId: user.orgId,
                action: dto.action,
                params: dto.params,
                scope: dto.scope,
            });

            return result;
        } catch (error) {
            if (error instanceof IntegrationNotFoundError) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            if (error instanceof IntegrationDisabledError) {
                throw new HttpException(error.message, HttpStatus.FORBIDDEN);
            }
            if (error instanceof PermissionDeniedError) {
                throw new HttpException(error.message, HttpStatus.FORBIDDEN);
            }
            throw error;
        }
    }

    @Delete(':integrationId')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete an integration' })
    async delete(
        @Param('integrationId') integrationId: string,
        @CurrentUser() user: AuthUser
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const integration = await this.integrationRepository.findById(integrationId);
        if (!integration || integration.orgId !== user.orgId) {
            throw new HttpException('Integration not found', HttpStatus.NOT_FOUND);
        }

        await this.integrationRepository.delete(integrationId);
        return { deleted: true };
    }
}
