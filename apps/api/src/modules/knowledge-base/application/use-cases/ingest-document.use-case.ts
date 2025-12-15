import { Injectable } from '@nestjs/common';
import { SourceType } from '../../domain/entities/kb-document.entity';
import { KbDocumentService } from '../../domain/services/kb-document.service';
import { KbDocumentRepository } from '../../infrastructure/persistence/kb-document.repository';
import { KbIngestQueueService } from '../../infrastructure/queue/kb-ingest-queue.service';

export interface IngestDocumentCommand {
    orgId: string;
    title: string;
    sourceType: SourceType;
    s3Key: string;
    tags?: string[];
}

export interface IngestDocumentResult {
    documentId: string;
    title: string;
    jobId: string;
}

@Injectable()
export class IngestDocumentUseCase {
    constructor(
        private readonly kbDocumentService: KbDocumentService,
        private readonly kbDocumentRepository: KbDocumentRepository,
        private readonly kbIngestQueueService: KbIngestQueueService
    ) { }

    async execute(command: IngestDocumentCommand): Promise<IngestDocumentResult> {
        // Create document entity
        const document = this.kbDocumentService.createDocument({
            orgId: command.orgId,
            title: command.title,
            sourceType: command.sourceType,
            s3Key: command.s3Key,
            tags: command.tags,
        });

        // Persist document
        await this.kbDocumentRepository.save(document);

        // Enqueue for processing (chunking + embedding)
        const jobId = await this.kbIngestQueueService.enqueue({
            documentId: document.id,
            orgId: document.orgId,
            s3Key: document.s3Key,
            sourceType: document.sourceType,
        });

        return {
            documentId: document.id,
            title: document.title,
            jobId,
        };
    }
}
