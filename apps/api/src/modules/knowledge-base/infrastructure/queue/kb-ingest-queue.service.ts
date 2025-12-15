import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { SourceType } from '../../domain/entities/kb-document.entity';

export interface KbIngestJobData {
    documentId: string;
    orgId: string;
    s3Key: string;
    sourceType: SourceType;
}

@Injectable()
export class KbIngestQueueService {
    private queue: Queue<KbIngestJobData> | null = null;

    constructor(private readonly config: ConfigService) { }

    private getQueue(): Queue<KbIngestJobData> {
        if (!this.queue) {
            const redisUrl = this.config.get<string>('REDIS_URL', 'redis://localhost:6379');
            const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

            this.queue = new Queue<KbIngestJobData>('kb_ingest', { connection });
        }
        return this.queue;
    }

    async enqueue(data: KbIngestJobData): Promise<string> {
        const job = await this.getQueue().add('ingest', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: 100,
            removeOnFail: 1000,
        });

        return job.id || '';
    }

    async getJob(jobId: string) {
        return this.getQueue().getJob(jobId);
    }
}
