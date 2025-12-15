import { Job, Processor } from 'bullmq';
import { topologicalSort } from '@nous/shared';

export interface RunJobData {
    runId: string;
    orgId: string;
    workflowVersionId: string;
    input: Record<string, unknown>;
}

export const runProcessor: Processor<RunJobData> = async (job: Job<RunJobData>) => {
    const { runId, orgId, workflowVersionId, input } = job.data;

    console.log(`🔄 Processing run: ${runId}`);
    console.log(`  Workflow version: ${workflowVersionId}`);
    console.log(`  Input: ${JSON.stringify(input)}`);

    try {
        // 1. Load workflow version and DAG
        // const workflowVersion = await loadWorkflowVersion(workflowVersionId);
        // const dag = workflowVersion.dagJson;

        // 2. Get execution order via topological sort
        // const executionOrder = topologicalSort(dag);

        // 3. Execute nodes in order
        // for (const nodeKey of executionOrder) {
        //   await executeNode(runId, nodeKey);
        // }

        // Placeholder: simulate execution
        await simulateExecution(runId);

        console.log(`✅ Run completed: ${runId}`);

        return { status: 'succeeded', runId };
    } catch (error) {
        console.error(`❌ Run failed: ${runId}`, error);
        throw error;
    }
};

async function simulateExecution(runId: string): Promise<void> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

    console.log(`  Simulated execution for run: ${runId}`);
}

// TODO: Implement actual node execution
// async function executeNode(runId: string, nodeKey: string): Promise<void> {
//   // 1. Load node config
//   // 2. Execute based on node type
//   // 3. Store output
//   // 4. Update node status
// }
