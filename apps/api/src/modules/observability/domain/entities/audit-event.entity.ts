/**
 * Audit Event Entity - Immutable audit trail record
 */

export type AuditEventType =
    | 'USER_LOGIN'
    | 'USER_LOGOUT'
    | 'ORG_CREATED'
    | 'ORG_MEMBER_ADDED'
    | 'WORKFLOW_CREATED'
    | 'WORKFLOW_PUBLISHED'
    | 'RUN_STARTED'
    | 'RUN_COMPLETED'
    | 'RUN_FAILED'
    | 'RUN_CANCELED'
    | 'DOCUMENT_INGESTED'
    | 'CANDIDATE_SCORED'
    | 'INTEGRATION_REGISTERED'
    | 'INTEGRATION_EXECUTED'
    | 'SECRET_ACCESSED';

export interface AuditEvent {
    id: string;
    orgId: string;
    userId: string | null;
    eventType: AuditEventType;
    entityType: string;
    entityId: string;
    metadata: Record<string, unknown>;
    ipAddress: string | null;
    userAgent: string | null;
    timestamp: Date;
}

export interface CreateAuditEventInput {
    orgId: string;
    userId?: string;
    eventType: AuditEventType;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}

export class AuditEventEntity {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly userId: string | null,
        public readonly eventType: AuditEventType,
        public readonly entityType: string,
        public readonly entityId: string,
        public readonly metadata: Record<string, unknown>,
        public readonly ipAddress: string | null,
        public readonly userAgent: string | null,
        public readonly timestamp: Date
    ) { }

    static create(input: CreateAuditEventInput & { id: string }): AuditEventEntity {
        return new AuditEventEntity(
            input.id,
            input.orgId,
            input.userId || null,
            input.eventType,
            input.entityType,
            input.entityId,
            input.metadata || {},
            input.ipAddress || null,
            input.userAgent || null,
            new Date()
        );
    }

    toObject(): AuditEvent {
        return {
            id: this.id,
            orgId: this.orgId,
            userId: this.userId,
            eventType: this.eventType,
            entityType: this.entityType,
            entityId: this.entityId,
            metadata: this.metadata,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
            timestamp: this.timestamp,
        };
    }
}
