import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { runProcessor } from './queues/runs.processor';
import { kbIngestProcessor } from './queues/kb-ingest.processor';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function main() {
    console.log('🧠 Starting Nous Workers...');

    const connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });

    // Run Executor Worker
    const runWorker = new Worker('runs', runProcessor, {
        connection,
        concurrency: 5,
    });

    runWorker.on('completed', (job) => {
        console.log(`✅ Run completed: ${job.id}`);
    });

    runWorker.on('failed', (job, err) => {
        console.error(`❌ Run failed: ${job?.id}`, err.message);
    });

    // KB Ingestion Worker
    const kbWorker = new Worker('kb_ingest', kbIngestProcessor, {
        connection,
        concurrency: 2,
    });

    kbWorker.on('completed', (job) => {
        console.log(`✅ KB ingestion completed: ${job.id}`);
    });

    kbWorker.on('failed', (job, err) => {
        console.error(`❌ KB ingestion failed: ${job?.id}`, err.message);
    });

    console.log('👷 Workers running:');
    console.log('  - runs (concurrency: 5)');
    console.log('  - kb_ingest (concurrency: 2)');

    // Graceful shutdown
    const shutdown = async () => {
        console.log('🛑 Shutting down workers...');
        await runWorker.close();
        await kbWorker.close();
        await connection.quit();
        process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

main().catch((err) => {
    console.error('Failed to start workers:', err);
    process.exit(1);
});
