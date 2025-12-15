import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { EmbeddingGenerationError } from '../../domain/errors';

@Injectable()
export class EmbeddingService {
    private openai: OpenAI | null = null;

    constructor(private readonly config: ConfigService) { }

    private getClient(): OpenAI {
        if (!this.openai) {
            const apiKey = this.config.get<string>('OPENAI_API_KEY');
            if (!apiKey) {
                throw new EmbeddingGenerationError('OPENAI_API_KEY not configured');
            }
            this.openai = new OpenAI({ apiKey });
        }
        return this.openai;
    }

    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await this.getClient().embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
                dimensions: 1536,
            });

            return response.data[0].embedding;
        } catch (error) {
            throw new EmbeddingGenerationError(
                `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        try {
            const response = await this.getClient().embeddings.create({
                model: 'text-embedding-3-small',
                input: texts,
                dimensions: 1536,
            });

            return response.data.map((d) => d.embedding);
        } catch (error) {
            throw new EmbeddingGenerationError(
                `Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}
