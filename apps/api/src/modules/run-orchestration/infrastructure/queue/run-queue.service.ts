import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export interface RunJobData {
    runId: string;
    orgId: string;
    workflowVersionId: string;
    input: Record<string, unknown>;
}

@Injectable()
export class RunQueueService {
    private queue: Queue<RunJobData> | null = null;

    constructor(private readonly config: ConfigService) { }

    private getQueue(): Queue<RunJobData> {
        if (!this.queue) {
            const redisUrl = this.config.get<string>('REDIS_URL', 'redis://localhost:6379');
            const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

            this.queue = new Queue<RunJobData>('runs', { connection });
        }
        return this.queue;
    }

    async enqueue(data: RunJobData): Promise<string> {
        const job = await this.getQueue().add('execute', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
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
