import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { IdentityAccessModule } from './modules/identity-access/identity-access.module';
import { WorkflowCatalogModule } from './modules/workflow-catalog/workflow-catalog.module';
import { RunOrchestrationModule } from './modules/run-orchestration/run-orchestration.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { HrScoringModule } from './modules/hr-scoring/hr-scoring.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),

        // Infrastructure
        PrismaModule,

        // Feature Modules
        HealthModule,
        IdentityAccessModule,
        WorkflowCatalogModule,
        RunOrchestrationModule,
        KnowledgeBaseModule,
        HrScoringModule,
    ],
})
export class AppModule { }
