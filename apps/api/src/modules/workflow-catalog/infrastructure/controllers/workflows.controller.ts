import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WorkflowDagSchema } from '@nous/shared';
import { CreateWorkflowUseCase } from '../../application/use-cases/create-workflow.use-case';
import { PublishWorkflowVersionUseCase } from '../../application/use-cases/publish-workflow-version.use-case';
import { GetWorkflowUseCase } from '../../application/use-cases/get-workflow.use-case';
import { ListWorkflowsUseCase } from '../../application/use-cases/list-workflows.use-case';
import { JwtAuthGuard } from '@/modules/identity-access/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '@/modules/identity-access/infrastructure/auth/roles.guard';
import { CurrentUser } from '@/modules/identity-access/infrastructure/auth/current-user.decorator';
import { Roles } from '@/modules/identity-access/infrastructure/auth/roles.decorator';
import { Role } from '@/modules/identity-access/domain/value-objects/role.value-object';
import { AuthUser } from '@/modules/identity-access/infrastructure/auth/jwt.strategy';
import { DagValidationError } from '../../domain/entities/workflow-version.entity';
import {
    WorkflowNotFoundError,
    WorkflowAccessDeniedError,
} from '../../domain/errors';

// DTOs
class CreateWorkflowDto {
    name: string;
    description?: string;
}

class PublishVersionDto {
    dag: {
        nodes: Array<{
            key: string;
            type: string;
            config: Record<string, unknown>;
            timeoutMs?: number;
            retryPolicy?: {
                maxAttempts?: number;
                backoffMs?: number;
                retryOn?: string[];
            };
        }>;
        edges: Array<{
            from: string;
            to: string;
            condition?: string;
        }>;
    };
}

@ApiTags('Workflows')
@Controller('workflows')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkflowsController {
    constructor(
        private readonly createWorkflow: CreateWorkflowUseCase,
        private readonly publishVersion: PublishWorkflowVersionUseCase,
        private readonly getWorkflow: GetWorkflowUseCase,
        private readonly listWorkflows: ListWorkflowsUseCase
    ) { }

    @Post()
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Create a new workflow' })
    async create(@Body() dto: CreateWorkflowDto, @CurrentUser() user: AuthUser) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.createWorkflow.execute({
            orgId: user.orgId,
            name: dto.name,
            description: dto.description,
            createdBy: user.userId,
        });

        return result;
    }

    @Get()
    @ApiOperation({ summary: 'List workflows' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'cursor', required: false, type: String })
    async list(
        @CurrentUser() user: AuthUser,
        @Query('limit') limit?: string,
        @Query('cursor') cursor?: string
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.listWorkflows.execute({
            orgId: user.orgId,
            limit: limit ? parseInt(limit, 10) : undefined,
            cursor,
        });

        return result;
    }

    @Get(':workflowId')
    @ApiOperation({ summary: 'Get workflow by ID' })
    @ApiQuery({ name: 'includeVersions', required: false, type: Boolean })
    async get(
        @Param('workflowId') workflowId: string,
        @CurrentUser() user: AuthUser,
        @Query('includeVersions') includeVersions?: string
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        try {
            const result = await this.getWorkflow.execute({
                workflowId,
                orgId: user.orgId,
                includeVersions: includeVersions === 'true',
            });

            return result;
        } catch (error) {
            if (error instanceof WorkflowNotFoundError) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            if (error instanceof WorkflowAccessDeniedError) {
                throw new HttpException(error.message, HttpStatus.FORBIDDEN);
            }
            throw error;
        }
    }

    @Post(':workflowId/versions')
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Publish a new workflow version' })
    async publishWorkflowVersion(
        @Param('workflowId') workflowId: string,
        @Body() dto: PublishVersionDto,
        @CurrentUser() user: AuthUser
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        // Validate DAG schema
        const dagResult = WorkflowDagSchema.safeParse(dto.dag);
        if (!dagResult.success) {
            throw new HttpException(
                {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid DAG schema',
                    errors: dagResult.error.errors,
                },
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            const result = await this.publishVersion.execute({
                workflowId,
                orgId: user.orgId,
                dagJson: dagResult.data,
                createdBy: user.userId,
            });

            return result;
        } catch (error) {
            if (error instanceof WorkflowNotFoundError) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            if (error instanceof WorkflowAccessDeniedError) {
                throw new HttpException(error.message, HttpStatus.FORBIDDEN);
            }
            if (error instanceof DagValidationError) {
                throw new HttpException(
                    {
                        code: 'DAG_VALIDATION_ERROR',
                        message: error.message,
                        errors: error.errors,
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
            throw error;
        }
    }
}
