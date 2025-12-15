import { Injectable } from '@nestjs/common';
import { AuditEventRepository } from '../../infrastructure/persistence/audit-event.repository';
import { AuditEvent, AuditEventType } from '../../domain/entities/audit-event.entity';

export interface QueryAuditEventsQuery {
    orgId: string;
    eventType?: AuditEventType;
    entityType?: string;
    entityId?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    cursor?: string;
}

export interface QueryAuditEventsResult {
    events: AuditEvent[];
    total: number;
    nextCursor?: string;
}

@Injectable()
export class QueryAuditEventsUseCase {
    constructor(private readonly auditEventRepository: AuditEventRepository) { }

    async execute(query: QueryAuditEventsQuery): Promise<QueryAuditEventsResult> {
        const limit = query.limit || 50;

        const events = await this.auditEventRepository.query({
            orgId: query.orgId,
            eventType: query.eventType,
            entityType: query.entityType,
            entityId: query.entityId,
            userId: query.userId,
            startDate: query.startDate,
            endDate: query.endDate,
            limit: limit + 1,
            cursor: query.cursor,
        });

        const hasMore = events.length > limit;
        const items = hasMore ? events.slice(0, limit) : events;

        const total = await this.auditEventRepository.count({
            orgId: query.orgId,
            eventType: query.eventType,
            entityType: query.entityType,
        });

        return {
            events: items.map((e) => e.toObject()),
            total,
            nextCursor: hasMore ? items[items.length - 1].id : undefined,
        };
    }
}
