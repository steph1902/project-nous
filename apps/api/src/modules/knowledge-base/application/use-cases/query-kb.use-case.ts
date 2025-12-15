import { Injectable } from '@nestjs/common';
import { KbChunkRepository } from '../../infrastructure/persistence/kb-chunk.repository';
import { EmbeddingService } from '../../infrastructure/ai/embedding.service';
import { ChunkSearchResult } from '../../domain/entities/kb-chunk.entity';

export interface QueryKnowledgeBaseQuery {
    orgId: string;
    query: string;
    topK?: number;
    tags?: string[];
}

export interface QueryKnowledgeBaseResult {
    results: ChunkSearchResult[];
    query: string;
    totalTokens: number;
}

@Injectable()
export class QueryKnowledgeBaseUseCase {
    constructor(
        private readonly kbChunkRepository: KbChunkRepository,
        private readonly embeddingService: EmbeddingService
    ) { }

    async execute(query: QueryKnowledgeBaseQuery): Promise<QueryKnowledgeBaseResult> {
        const topK = query.topK || 5;

        // Generate embedding for query
        const queryEmbedding = await this.embeddingService.generateEmbedding(query.query);

        // Search for similar chunks using vector similarity
        const results = await this.kbChunkRepository.searchSimilar(
            query.orgId,
            queryEmbedding,
            topK,
            query.tags
        );

        // Calculate total tokens
        const totalTokens = results.reduce((sum, r) => sum + r.chunk.tokenCount, 0);

        return {
            results,
            query: query.query,
            totalTokens,
        };
    }
}
