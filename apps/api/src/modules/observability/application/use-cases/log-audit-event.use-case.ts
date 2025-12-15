import { Injectable } from '@nestjs/common';
import { AuditService } from '../../domain/services/audit.service';
import { AuditEventRepository } from '../../infrastructure/persistence/audit-event.repository';
import { AuditEventType } from '../../domain/entities/audit-event.entity';

export interface LogAuditEventCommand {
    orgId: string;
    userId?: string;
    eventType: AuditEventType;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}

@Injectable()
export class LogAuditEventUseCase {
    constructor(
        private readonly auditService: AuditService,
        private readonly auditEventRepository: AuditEventRepository
    ) { }

    async execute(command: LogAuditEventCommand): Promise<void> {
        const event = this.auditService.createEvent({
            orgId: command.orgId,
            userId: command.userId,
            eventType: command.eventType,
            entityType: command.entityType,
            entityId: command.entityId,
            metadata: command.metadata,
            ipAddress: command.ipAddress,
            userAgent: command.userAgent,
        });

        await this.auditEventRepository.save(event);
    }
}
