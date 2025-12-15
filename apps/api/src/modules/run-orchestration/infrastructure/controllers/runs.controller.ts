import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    Delete,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StartRunUseCase } from '../../application/use-cases/start-run.use-case';
import { GetRunUseCase } from '../../application/use-cases/get-run.use-case';
import { CancelRunUseCase } from '../../application/use-cases/cancel-run.use-case';
import { RunRepository } from '../persistence/run.repository';
import { JwtAuthGuard } from '@/modules/identity-access/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '@/modules/identity-access/infrastructure/auth/roles.guard';
import { CurrentUser } from '@/modules/identity-access/infrastructure/auth/current-user.decorator';
import { Roles } from '@/modules/identity-access/infrastructure/auth/roles.decorator';
import { Role } from '@/modules/identity-access/domain/value-objects/role.value-object';
import { AuthUser } from '@/modules/identity-access/infrastructure/auth/jwt.strategy';
import {
    RunNotFoundError,
    RunAccessDeniedError,
    RunAlreadyTerminalError,
} from '../../domain/errors';

// DTOs
class StartRunDto {
    workflowId: string;
    input?: Record<string, unknown>;
    idempotencyKey?: string;
}

@ApiTags('Runs')
@Controller('runs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RunsController {
    constructor(
        private readonly startRun: StartRunUseCase,
        private readonly getRun: GetRunUseCase,
        private readonly cancelRun: CancelRunUseCase,
        private readonly runRepository: RunRepository
    ) { }

    @Post()
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Start a new run' })
    async start(@Body() dto: StartRunDto, @CurrentUser() user: AuthUser) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        try {
            const result = await this.startRun.execute({
                workflowId: dto.workflowId,
                orgId: user.orgId,
                initiatedBy: user.userId,
                input: dto.input,
                idempotencyKey: dto.idempotencyKey,
            });

            return result;
        } catch (error) {
            if (error instanceof Error && error.name === 'WorkflowVersionNotFoundError') {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }

    @Get()
    @ApiOperation({ summary: 'List runs' })
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

        const runs = await this.runRepository.findByOrgId(
            user.orgId,
            limit ? parseInt(limit, 10) : 20,
            cursor
        );

        const total = await this.runRepository.countByOrgId(user.orgId);

        return {
            runs: runs.map((r) => r.toObject()),
            total,
            nextCursor: runs.length > 0 ? runs[runs.length - 1].id : undefined,
        };
    }

    @Get(':runId')
    @ApiOperation({ summary: 'Get run by ID' })
    @ApiQuery({ name: 'includeNodes', required: false, type: Boolean })
    async get(
        @Param('runId') runId: string,
        @CurrentUser() user: AuthUser,
        @Query('includeNodes') includeNodes?: string
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        try {
            const result = await this.getRun.execute({
                runId,
                orgId: user.orgId,
                includeNodes: includeNodes === 'true',
            });

            return result;
        } catch (error) {
            if (error instanceof RunNotFoundError) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            if (error instanceof RunAccessDeniedError) {
                throw new HttpException(error.message, HttpStatus.FORBIDDEN);
            }
            throw error;
        }
    }

    @Delete(':runId')
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Cancel a run' })
    async cancel(@Param('runId') runId: string, @CurrentUser() user: AuthUser) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        try {
            const result = await this.cancelRun.execute({
                runId,
                orgId: user.orgId,
            });

            return result;
        } catch (error) {
            if (error instanceof RunNotFoundError) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            if (error instanceof RunAccessDeniedError) {
                throw new HttpException(error.message, HttpStatus.FORBIDDEN);
            }
            if (error instanceof RunAlreadyTerminalError) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw error;
        }
    }
}
