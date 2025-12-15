import { Injectable } from '@nestjs/common';
import { AuditEventEntity, CreateAuditEventInput } from '../entities/audit-event.entity';
import { generateAuditEventId } from '@nous/shared';

@Injectable()
export class AuditService {
  createEvent(input: CreateAuditEventInput): AuditEventEntity {
    const id = generateAuditEventId();
    return AuditEventEntity.create({ ...input, id });
  }
}
