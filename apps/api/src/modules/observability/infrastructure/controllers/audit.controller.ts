import {
    Controller,
    Get,
    Query,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QueryAuditEventsUseCase } from '../../application/use-cases/query-audit-events.use-case';
import { JwtAuthGuard } from '@/modules/identity-access/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '@/modules/identity-access/infrastructure/auth/roles.guard';
import { CurrentUser } from '@/modules/identity-access/infrastructure/auth/current-user.decorator';
import { Roles } from '@/modules/identity-access/infrastructure/auth/roles.decorator';
import { Role } from '@/modules/identity-access/domain/value-objects/role.value-object';
import { AuthUser } from '@/modules/identity-access/infrastructure/auth/jwt.strategy';
import { AuditEventType } from '../../domain/entities/audit-event.entity';

@ApiTags('Audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditController {
    constructor(private readonly queryAuditEvents: QueryAuditEventsUseCase) { }

    @Get('events')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Query audit events' })
    @ApiQuery({ name: 'eventType', required: false })
    @ApiQuery({ name: 'entityType', required: false })
    @ApiQuery({ name: 'entityId', required: false })
    @ApiQuery({ name: 'userId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'cursor', required: false })
    async query(
        @CurrentUser() user: AuthUser,
        @Query('eventType') eventType?: AuditEventType,
        @Query('entityType') entityType?: string,
        @Query('entityId') entityId?: string,
        @Query('userId') userId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('limit') limit?: string,
        @Query('cursor') cursor?: string
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.queryAuditEvents.execute({
            orgId: user.orgId,
            eventType,
            entityType,
            entityId,
            userId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            cursor,
        });

        return result;
    }
}
