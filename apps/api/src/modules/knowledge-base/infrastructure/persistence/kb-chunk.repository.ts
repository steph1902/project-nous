import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { KbChunkEntity, ChunkSearchResult } from '../../domain/entities/kb-chunk.entity';

@Injectable()
export class KbChunkRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByDocumentId(documentId: string): Promise<KbChunkEntity[]> {
        const chunks = await this.prisma.kbChunk.findMany({
            where: { documentId },
            orderBy: { chunkIndex: 'asc' },
        });

        return chunks.map(
            (c) =>
                new KbChunkEntity(
                    c.id,
                    c.documentId,
                    c.chunkIndex,
                    c.contentText,
                    c.tokenCount,
                    c.metadataJson as Record<string, unknown>
                )
        );
    }

    /**
     * Search for similar chunks using pgvector
     */
    async searchSimilar(
        orgId: string,
        queryEmbedding: number[],
        topK: number = 5,
        tags?: string[]
    ): Promise<ChunkSearchResult[]> {
        // Using raw query for pgvector cosine similarity
        const embeddingString = `[${queryEmbedding.join(',')}]`;

        const results = await this.prisma.$queryRaw<
            Array<{
                id: string;
                document_id: string;
                chunk_index: number;
                content_text: string;
                token_count: number;
                metadata_json: any;
                score: number;
                document_title: string;
            }>
        >`
      SELECT 
        c.id,
        c.document_id,
        c.chunk_index,
        c.content_text,
        c.token_count,
        c.metadata_json,
        1 - (c.embedding <=> ${embeddingString}::vector) as score,
        d.title as document_title
      FROM kb_chunks c
      JOIN kb_documents d ON c.document_id = d.id
      WHERE d.org_id = ${orgId}
      ${tags && tags.length > 0 ? `AND d.tags_json ?| array[${tags.map((t) => `'${t}'`).join(',')}]` : ''}
      ORDER BY c.embedding <=> ${embeddingString}::vector
      LIMIT ${topK}
    `;

        return results.map((r) => ({
            chunk: {
                id: r.id,
                documentId: r.document_id,
                chunkIndex: r.chunk_index,
                contentText: r.content_text,
                tokenCount: r.token_count,
                metadata: r.metadata_json || {},
            },
            score: r.score,
            documentTitle: r.document_title,
        }));
    }

    async saveWithEmbedding(
        chunk: KbChunkEntity,
        embedding: number[]
    ): Promise<void> {
        const embeddingString = `[${embedding.join(',')}]`;

        await this.prisma.$executeRaw`
      INSERT INTO kb_chunks (id, document_id, chunk_index, content_text, token_count, metadata_json, embedding)
      VALUES (
        ${chunk.id},
        ${chunk.documentId},
        ${chunk.chunkIndex},
        ${chunk.contentText},
        ${chunk.tokenCount},
        ${JSON.stringify(chunk.metadata)}::jsonb,
        ${embeddingString}::vector
      )
      ON CONFLICT (id) DO UPDATE SET
        content_text = EXCLUDED.content_text,
        token_count = EXCLUDED.token_count,
        metadata_json = EXCLUDED.metadata_json,
        embedding = EXCLUDED.embedding
    `;
    }

    async deleteByDocumentId(documentId: string): Promise<void> {
        await this.prisma.kbChunk.deleteMany({ where: { documentId } });
    }
}
