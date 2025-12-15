import { z } from 'zod';

/**
 * Workflow DAG Schema - Single source of truth for workflow structure
 */

// Node types
export const NodeTypeSchema = z.enum([
    'manual',
    'webhook',
    'schedule',
    'agent_task',
    'tool_http',
    'tool_slack',
    'tool_gmail',
    'tool_sheets',
    'rag_query',
    'transform',
    'human_approval',
    'output',
]);

export type NodeType = z.infer<typeof NodeTypeSchema>;

// Retry policy
export const RetryPolicySchema = z.object({
    maxAttempts: z.number().min(1).max(10).default(3),
    backoffMs: z.number().min(100).max(60000).default(1000),
    retryOn: z.array(z.enum(['timeout', '429', '5xx'])).default(['timeout', '429', '5xx']),
});

export type RetryPolicy = z.infer<typeof RetryPolicySchema>;

// Node schema
export const DagNodeSchema = z.object({
    key: z.string().min(1).max(64),
    type: NodeTypeSchema,
    config: z.record(z.unknown()).default({}),
    timeoutMs: z.number().min(1000).max(300000).optional(),
    retryPolicy: RetryPolicySchema.optional(),
    permissions: z.array(z.string()).optional(),
});

export type DagNode = z.infer<typeof DagNodeSchema>;

// Edge schema
export const DagEdgeSchema = z.object({
    from: z.string(),
    to: z.string(),
    condition: z.string().optional(),
});

export type DagEdge = z.infer<typeof DagEdgeSchema>;

// Complete DAG schema
export const WorkflowDagSchema = z.object({
    nodes: z.array(DagNodeSchema).min(1),
    edges: z.array(DagEdgeSchema),
});

export type WorkflowDag = z.infer<typeof WorkflowDagSchema>;

// Workflow version status
export const WorkflowVersionStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export type WorkflowVersionStatus = z.infer<typeof WorkflowVersionStatusSchema>;

// Trigger types
export const TriggerTypeSchema = z.enum(['MANUAL', 'WEBHOOK', 'SCHEDULE']);

export type TriggerType = z.infer<typeof TriggerTypeSchema>;

// Create workflow input
export const CreateWorkflowInputSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
});

export type CreateWorkflowInput = z.infer<typeof CreateWorkflowInputSchema>;

// Publish workflow version input
export const PublishWorkflowVersionInputSchema = z.object({
    dag: WorkflowDagSchema,
});

export type PublishWorkflowVersionInput = z.infer<typeof PublishWorkflowVersionInputSchema>;

/**
 * DAG Validation utilities
 */
export function validateDag(dag: WorkflowDag): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for exactly one trigger
    const triggerNodes = dag.nodes.filter((n) =>
        ['manual', 'webhook', 'schedule'].includes(n.type)
    );
    if (triggerNodes.length === 0) {
        errors.push('Workflow must have at least one trigger node');
    }
    if (triggerNodes.length > 1) {
        errors.push('Workflow can only have one trigger node');
    }

    // Check for unique node keys
    const nodeKeys = dag.nodes.map((n) => n.key);
    const uniqueKeys = new Set(nodeKeys);
    if (uniqueKeys.size !== nodeKeys.length) {
        errors.push('All node keys must be unique');
    }

    // Check edges reference valid nodes
    for (const edge of dag.edges) {
        if (!uniqueKeys.has(edge.from)) {
            errors.push(`Edge references non-existent node: ${edge.from}`);
        }
        if (!uniqueKeys.has(edge.to)) {
            errors.push(`Edge references non-existent node: ${edge.to}`);
        }
    }

    // Check for cycles using topological sort
    const hasCycle = detectCycle(dag);
    if (hasCycle) {
        errors.push('Workflow contains a cycle');
    }

    return { valid: errors.length === 0, errors };
}

function detectCycle(dag: WorkflowDag): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const adjacency = new Map<string, string[]>();
    for (const node of dag.nodes) {
        adjacency.set(node.key, []);
    }
    for (const edge of dag.edges) {
        adjacency.get(edge.from)?.push(edge.to);
    }

    function dfs(nodeKey: string): boolean {
        visited.add(nodeKey);
        recStack.add(nodeKey);

        for (const neighbor of adjacency.get(nodeKey) || []) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor)) return true;
            } else if (recStack.has(neighbor)) {
                return true;
            }
        }

        recStack.delete(nodeKey);
        return false;
    }

    for (const node of dag.nodes) {
        if (!visited.has(node.key)) {
            if (dfs(node.key)) return true;
        }
    }

    return false;
}

/**
 * Topologically sort nodes for execution order
 */
export function topologicalSort(dag: WorkflowDag): string[] {
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    for (const node of dag.nodes) {
        inDegree.set(node.key, 0);
        adjacency.set(node.key, []);
    }

    for (const edge of dag.edges) {
        adjacency.get(edge.from)?.push(edge.to);
        inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }

    const queue: string[] = [];
    for (const [key, degree] of inDegree) {
        if (degree === 0) queue.push(key);
    }

    const result: string[] = [];
    while (queue.length > 0) {
        const node = queue.shift()!;
        result.push(node);

        for (const neighbor of adjacency.get(node) || []) {
            inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }

    return result;
}
