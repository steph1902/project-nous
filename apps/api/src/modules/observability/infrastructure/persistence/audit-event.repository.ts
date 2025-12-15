import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { AuditEventEntity, AuditEventType } from '../../domain/entities/audit-event.entity';

export interface AuditEventQuery {
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

@Injectable()
export class AuditEventRepository {
    constructor(private readonly prisma: PrismaService) { }

    async query(query: AuditEventQuery): Promise<AuditEventEntity[]> {
        const events = await this.prisma.auditEvent.findMany({
            where: {
                orgId: query.orgId,
                ...(query.eventType && { eventType: query.eventType }),
                ...(query.entityType && { entityType: query.entityType }),
                ...(query.entityId && { entityId: query.entityId }),
                ...(query.userId && { userId: query.userId }),
                ...(query.startDate && { timestamp: { gte: query.startDate } }),
                ...(query.endDate && { timestamp: { lte: query.endDate } }),
            },
            orderBy: { timestamp: 'desc' },
            take: query.limit || 50,
            ...(query.cursor && {
                cursor: { id: query.cursor },
                skip: 1,
            }),
        });

        return events.map((e) =>
            new AuditEventEntity(
                e.id,
                e.orgId,
                e.userId,
                e.eventType as AuditEventType,
                e.entityType,
                e.entityId,
                e.metadataJson as Record<string, unknown>,
                e.ipAddress,
                e.userAgent,
                e.timestamp
            )
        );
    }

    async count(query: {
        orgId: string;
        eventType?: AuditEventType;
        entityType?: string;
    }): Promise<number> {
        return this.prisma.auditEvent.count({
            where: {
                orgId: query.orgId,
                ...(query.eventType && { eventType: query.eventType }),
                ...(query.entityType && { entityType: query.entityType }),
            },
        });
    }

    async save(event: AuditEventEntity): Promise<void> {
        await this.prisma.auditEvent.create({
            data: {
                id: event.id,
                orgId: event.orgId,
                userId: event.userId,
                eventType: event.eventType,
                entityType: event.entityType,
                entityId: event.entityId,
                metadataJson: event.metadata,
                ipAddress: event.ipAddress,
                userAgent: event.userAgent,
                timestamp: event.timestamp,
            },
        });
    }
}
