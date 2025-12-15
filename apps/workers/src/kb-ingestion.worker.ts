/**
 * Knowledge Base Ingestion Worker
 * Processes document ingestion jobs: chunking + embedding generation
 */
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import OpenAI from 'openai';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface IngestJobData {
    documentId: string;
    orgId: string;
    content: string;
    sourceType: string;
}

interface Chunk {
    index: number;
    text: string;
    tokenCount: number;
}

// Chunking configuration
const CHUNK_SIZE = 500; // tokens
const CHUNK_OVERLAP = 50; // tokens

function estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

function chunkText(text: string): Chunk[] {
    const chunks: Chunk[] = [];
    const words = text.split(/\s+/);
    let currentChunk: string[] = [];
    let currentTokens = 0;

    for (const word of words) {
        const wordTokens = estimateTokens(word);

        if (currentTokens + wordTokens > CHUNK_SIZE && currentChunk.length > 0) {
            chunks.push({
                index: chunks.length,
                text: currentChunk.join(' '),
                tokenCount: currentTokens,
            });

            // Keep overlap
            const overlapWords = currentChunk.slice(-Math.ceil(CHUNK_OVERLAP / 2));
            currentChunk = [...overlapWords, word];
            currentTokens = estimateTokens(currentChunk.join(' '));
        } else {
            currentChunk.push(word);
            currentTokens += wordTokens;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push({
            index: chunks.length,
            text: currentChunk.join(' '),
            tokenCount: currentTokens,
        });
    }

    return chunks;
}

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!OPENAI_API_KEY) {
        console.warn('[KB Ingestion] No OpenAI API key, returning mock embeddings');
        return texts.map(() => Array(1536).fill(0).map(() => Math.random() - 0.5));
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
    });

    return response.data.map((d) => d.embedding);
}

async function processIngestion(job: Job<IngestJobData>): Promise<void> {
    const { documentId, content, sourceType } = job.data;

    console.log(`[KB Ingestion] Processing document ${documentId} (${sourceType})`);

    // 1. Chunk the content
    const chunks = chunkText(content);
    console.log(`[KB Ingestion] Created ${chunks.length} chunks`);

    // 2. Generate embeddings for all chunks
    const texts = chunks.map((c) => c.text);
    const embeddings = await generateEmbeddings(texts);
    console.log(`[KB Ingestion] Generated ${embeddings.length} embeddings`);

    // 3. TODO: Save chunks with embeddings to database
    // This would call the KbChunkRepository.saveMany()
    for (let i = 0; i < chunks.length; i++) {
        console.log(`[KB Ingestion] Chunk ${i}: ${chunks[i].tokenCount} tokens, embedding dim: ${embeddings[i].length}`);
    }

    console.log(`[KB Ingestion] Completed document ${documentId}`);
}

export function startKbIngestionWorker(): Worker {
    const connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });

    const worker = new Worker<IngestJobData>('kb-ingest', processIngestion, {
        connection,
        concurrency: 3,
    });

    worker.on('completed', (job) => {
        console.log(`[KB Ingestion] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        console.error(`[KB Ingestion] Job ${job?.id} failed:`, err);
    });

    console.log('[KB Ingestion] Worker started');

    return worker;
}

// Export for testing
export { chunkText, generateEmbeddings };
