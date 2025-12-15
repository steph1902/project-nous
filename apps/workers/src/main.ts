/**
 * Nous Workers - Background Job Processors
 *
 * This service runs BullMQ workers that process:
 * - Workflow run execution
 * - Knowledge base document ingestion
 * - HR candidate scoring
 */
import { startRunExecutorWorker } from './run-executor.worker';
import { startKbIngestionWorker } from './kb-ingestion.worker';
import { startHrScoringWorker } from './hr-scoring.worker';

async function main() {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║           Nous Workers v0.1.0              ║');
    console.log('║     Background Job Processing Service      ║');
    console.log('╚════════════════════════════════════════════╝');

    // Start all workers
    const runWorker = startRunExecutorWorker();
    const kbWorker = startKbIngestionWorker();
    const hrWorker = startHrScoringWorker();

    console.log('\n[Workers] All workers started successfully\n');

    // Graceful shutdown
    const shutdown = async () => {
        console.log('\n[Workers] Shutting down...');

        await Promise.all([
            runWorker.close(),
            kbWorker.close(),
            hrWorker.close(),
        ]);

        console.log('[Workers] All workers stopped');
        process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    // Keep process running
    await new Promise(() => { });
}

main().catch((err) => {
    console.error('[Workers] Fatal error:', err);
    process.exit(1);
});
