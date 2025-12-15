import { Injectable } from '@nestjs/common';
import { KbDocumentRepository } from '../../infrastructure/persistence/kb-document.repository';
import { KbDocument } from '../../domain/entities/kb-document.entity';

export interface ListDocumentsQuery {
    orgId: string;
    tags?: string[];
    limit?: number;
    cursor?: string;
}

export interface ListDocumentsResult {
    documents: KbDocument[];
    total: number;
    nextCursor?: string;
}

@Injectable()
export class ListDocumentsUseCase {
    constructor(private readonly kbDocumentRepository: KbDocumentRepository) { }

    async execute(query: ListDocumentsQuery): Promise<ListDocumentsResult> {
        const limit = query.limit || 20;

        const documents = await this.kbDocumentRepository.findByOrgId(
            query.orgId,
            limit + 1,
            query.cursor,
            query.tags
        );

        const hasMore = documents.length > limit;
        const items = hasMore ? documents.slice(0, limit) : documents;

        const total = await this.kbDocumentRepository.countByOrgId(query.orgId);

        return {
            documents: items.map((d) => d.toObject()),
            total,
            nextCursor: hasMore ? items[items.length - 1].id : undefined,
        };
    }
}
