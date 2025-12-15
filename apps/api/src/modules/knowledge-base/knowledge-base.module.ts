import { Module } from '@nestjs/common';
import { KbDocumentService } from './domain/services/kb-document.service';
import { IngestDocumentUseCase } from './application/use-cases/ingest-document.use-case';
import { QueryKnowledgeBaseUseCase } from './application/use-cases/query-kb.use-case';
import { ListDocumentsUseCase } from './application/use-cases/list-documents.use-case';
import { KbDocumentRepository } from './infrastructure/persistence/kb-document.repository';
import { KbChunkRepository } from './infrastructure/persistence/kb-chunk.repository';
import { KnowledgeBaseController } from './infrastructure/controllers/knowledge-base.controller';
import { KbIngestQueueService } from './infrastructure/queue/kb-ingest-queue.service';
import { EmbeddingService } from './infrastructure/ai/embedding.service';

@Module({
    controllers: [KnowledgeBaseController],
    providers: [
        // Domain Services
        KbDocumentService,

        // Use Cases
        IngestDocumentUseCase,
        QueryKnowledgeBaseUseCase,
        ListDocumentsUseCase,

        // Repositories
        KbDocumentRepository,
        KbChunkRepository,

        // Infrastructure
        KbIngestQueueService,
        EmbeddingService,
    ],
    exports: [KbDocumentService, KbDocumentRepository],
})
export class KnowledgeBaseModule { }
