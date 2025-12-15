/**
 * Run Executor Worker
 * Processes workflow runs from the BullMQ queue
 */
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

interface RunJobData {
    runId: string;
    workflowVersionId: string;
    orgId: string;
    input: Record<string, unknown>;
}

interface NodeExecutionResult {
    nodeKey: string;
    status: 'succeeded' | 'failed';
    output?: unknown;
    error?: string;
    durationMs: number;
}

// Node type handlers
const nodeHandlers: Record<string, (config: unknown, input: unknown) => Promise<unknown>> = {
    manual: async () => ({ triggered: true }),
    webhook: async () => ({ triggered: true }),
    schedule: async () => ({ triggered: true }),

    agent_task: async (config, input) => {
        // TODO: Call OpenAI with the agent task prompt
        console.log('Executing agent_task:', config);
        return { result: 'Agent task completed', input };
    },

    tool_http: async (config) => {
        const { url, method = 'GET', headers = {}, body } = config as Record<string, unknown>;
        const response = await fetch(url as string, {
            method: method as string,
            headers: headers as Record<string, string>,
            body: body ? JSON.stringify(body) : undefined,
        });
        return response.json();
    },

    tool_slack: async (config) => {
        // TODO: Post to Slack
        console.log('Posting to Slack:', config);
        return { sent: true };
    },

    tool_gmail: async (config) => {
        // TODO: Send email via Gmail
        console.log('Sending email:', config);
        return { sent: true };
    },

    tool_sheets: async (config) => {
        // TODO: Read/write Google Sheets
        console.log('Accessing sheets:', config);
        return { success: true };
    },

    rag_query: async (config, input) => {
        // TODO: Query knowledge base
        console.log('RAG query:', config, input);
        return { answer: 'Answer from knowledge base', sources: [] };
    },

    transform: async (config, input) => {
        // TODO: Apply transformation logic
        console.log('Transform:', config);
        return input;
    },

    human_approval: async () => {
        // TODO: Wait for human approval (would need external trigger)
        console.log('Waiting for human approval');
        return { approved: true };
    },

    output: async (_config, input) => {
        return input;
    },
};

async function executeNode(
    nodeKey: string,
    nodeType: string,
    config: unknown,
    input: unknown
): Promise<NodeExecutionResult> {
    const startTime = Date.now();

    try {
        const handler = nodeHandlers[nodeType];
        if (!handler) {
            throw new Error(`Unknown node type: ${nodeType}`);
        }

        const output = await handler(config, input);

        return {
            nodeKey,
            status: 'succeeded',
            output,
            durationMs: Date.now() - startTime,
        };
    } catch (error) {
        return {
            nodeKey,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            durationMs: Date.now() - startTime,
        };
    }
}

async function processRun(job: Job<RunJobData>): Promise<void> {
    const { runId, workflowVersionId } = job.data;

    console.log(`[Run Executor] Processing run ${runId} for workflow version ${workflowVersionId}`);

    // TODO: In a real implementation:
    // 1. Load the workflow version DAG from the database
    // 2. Topologically sort nodes
    // 3. Execute each node in order, passing outputs to inputs
    // 4. Update run status and node statuses in the database
    // 5. Handle retries with exponential backoff

    // For now, just simulate execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`[Run Executor] Completed run ${runId}`);
}

export function startRunExecutorWorker(): Worker {
    const connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });

    const worker = new Worker<RunJobData>('workflow-runs', processRun, {
        connection,
        concurrency: 5,
        limiter: {
            max: 100,
            duration: 1000,
        },
    });

    worker.on('completed', (job) => {
        console.log(`[Run Executor] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        console.error(`[Run Executor] Job ${job?.id} failed:`, err);
    });

    console.log('[Run Executor] Worker started');

    return worker;
}

// Export node handlers for testing
export { nodeHandlers, executeNode };
