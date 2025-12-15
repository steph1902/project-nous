import { Injectable } from '@nestjs/common';
import {
    KbDocumentEntity,
    CreateKbDocumentInput,
} from '../entities/kb-document.entity';
import { KbChunkEntity, CreateKbChunkInput } from '../entities/kb-chunk.entity';
import { generateKbDocumentId, generateKbChunkId } from '@nous/shared';

@Injectable()
export class KbDocumentService {
    createDocument(input: CreateKbDocumentInput): KbDocumentEntity {
        const id = generateKbDocumentId();
        return KbDocumentEntity.create({ ...input, id });
    }

    createChunk(input: CreateKbChunkInput): KbChunkEntity {
        const id = generateKbChunkId();
        return KbChunkEntity.create({ ...input, id });
    }

    /**
     * Chunk text with overlap for better retrieval
     */
    chunkText(
        text: string,
        options: { chunkSize?: number; overlap?: number } = {}
    ): string[] {
        const chunkSize = options.chunkSize || 1000;
        const overlap = options.overlap || 100;

        const chunks: string[] = [];
        let start = 0;

        while (start < text.length) {
            const end = Math.min(start + chunkSize, text.length);
            chunks.push(text.slice(start, end));
            start = end - overlap;

            if (start + overlap >= text.length) break;
        }

        return chunks;
    }

    /**
     * Approximate token count (rough estimate: ~4 chars per token)
     */
    estimateTokenCount(text: string): number {
        return Math.ceil(text.length / 4);
    }
}
