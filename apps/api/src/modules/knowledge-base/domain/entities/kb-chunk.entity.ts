/**
 * KB Chunk Entity - Chunked text with embedding for vector search
 */

export interface KbChunk {
    id: string;
    documentId: string;
    chunkIndex: number;
    contentText: string;
    tokenCount: number;
    metadata: Record<string, unknown>;
}

export interface CreateKbChunkInput {
    documentId: string;
    chunkIndex: number;
    contentText: string;
    tokenCount: number;
    metadata?: Record<string, unknown>;
}

export class KbChunkEntity {
    constructor(
        public readonly id: string,
        public readonly documentId: string,
        public readonly chunkIndex: number,
        public readonly contentText: string,
        public readonly tokenCount: number,
        public readonly metadata: Record<string, unknown>
    ) { }

    static create(input: CreateKbChunkInput & { id: string }): KbChunkEntity {
        if (!input.contentText || input.contentText.trim().length === 0) {
            throw new Error('Chunk content cannot be empty');
        }

        return new KbChunkEntity(
            input.id,
            input.documentId,
            input.chunkIndex,
            input.contentText,
            input.tokenCount,
            input.metadata || {}
        );
    }

    toObject(): KbChunk {
        return {
            id: this.id,
            documentId: this.documentId,
            chunkIndex: this.chunkIndex,
            contentText: this.contentText,
            tokenCount: this.tokenCount,
            metadata: this.metadata,
        };
    }
}

/**
 * Search result with relevance score
 */
export interface ChunkSearchResult {
    chunk: KbChunk;
    score: number;
    documentTitle?: string;
}
