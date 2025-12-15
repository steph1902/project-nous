import { Module } from '@nestjs/common';
import { AuditService } from './domain/services/audit.service';
import { LogAuditEventUseCase } from './application/use-cases/log-audit-event.use-case';
import { QueryAuditEventsUseCase } from './application/use-cases/query-audit-events.use-case';
import { AuditEventRepository } from './infrastructure/persistence/audit-event.repository';
import { AuditController } from './infrastructure/controllers/audit.controller';
import { RunMonitorController } from './infrastructure/controllers/run-monitor.controller';

@Module({
    controllers: [AuditController, RunMonitorController],
    providers: [
        // Domain Services
        AuditService,

        // Use Cases
        LogAuditEventUseCase,
        QueryAuditEventsUseCase,

        // Repositories
        AuditEventRepository,
    ],
    exports: [AuditService, LogAuditEventUseCase],
})
export class ObservabilityModule { }
