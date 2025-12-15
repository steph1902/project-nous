"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishWorkflowVersionInputSchema = exports.CreateWorkflowInputSchema = exports.TriggerTypeSchema = exports.WorkflowVersionStatusSchema = exports.WorkflowDagSchema = exports.DagEdgeSchema = exports.DagNodeSchema = exports.RetryPolicySchema = exports.NodeTypeSchema = void 0;
exports.validateDag = validateDag;
exports.topologicalSort = topologicalSort;
const zod_1 = require("zod");
exports.NodeTypeSchema = zod_1.z.enum([
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
exports.RetryPolicySchema = zod_1.z.object({
    maxAttempts: zod_1.z.number().min(1).max(10).default(3),
    backoffMs: zod_1.z.number().min(100).max(60000).default(1000),
    retryOn: zod_1.z.array(zod_1.z.enum(['timeout', '429', '5xx'])).default(['timeout', '429', '5xx']),
});
exports.DagNodeSchema = zod_1.z.object({
    key: zod_1.z.string().min(1).max(64),
    type: exports.NodeTypeSchema,
    config: zod_1.z.record(zod_1.z.unknown()).default({}),
    timeoutMs: zod_1.z.number().min(1000).max(300000).optional(),
    retryPolicy: exports.RetryPolicySchema.optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.DagEdgeSchema = zod_1.z.object({
    from: zod_1.z.string(),
    to: zod_1.z.string(),
    condition: zod_1.z.string().optional(),
});
exports.WorkflowDagSchema = zod_1.z.object({
    nodes: zod_1.z.array(exports.DagNodeSchema).min(1),
    edges: zod_1.z.array(exports.DagEdgeSchema),
});
exports.WorkflowVersionStatusSchema = zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
exports.TriggerTypeSchema = zod_1.z.enum(['MANUAL', 'WEBHOOK', 'SCHEDULE']);
exports.CreateWorkflowInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(1000).optional(),
});
exports.PublishWorkflowVersionInputSchema = zod_1.z.object({
    dag: exports.WorkflowDagSchema,
});
function validateDag(dag) {
    const errors = [];
    const triggerNodes = dag.nodes.filter((n) => ['manual', 'webhook', 'schedule'].includes(n.type));
    if (triggerNodes.length === 0) {
        errors.push('Workflow must have at least one trigger node');
    }
    if (triggerNodes.length > 1) {
        errors.push('Workflow can only have one trigger node');
    }
    const nodeKeys = dag.nodes.map((n) => n.key);
    const uniqueKeys = new Set(nodeKeys);
    if (uniqueKeys.size !== nodeKeys.length) {
        errors.push('All node keys must be unique');
    }
    for (const edge of dag.edges) {
        if (!uniqueKeys.has(edge.from)) {
            errors.push(`Edge references non-existent node: ${edge.from}`);
        }
        if (!uniqueKeys.has(edge.to)) {
            errors.push(`Edge references non-existent node: ${edge.to}`);
        }
    }
    const hasCycle = detectCycle(dag);
    if (hasCycle) {
        errors.push('Workflow contains a cycle');
    }
    return { valid: errors.length === 0, errors };
}
function detectCycle(dag) {
    const visited = new Set();
    const recStack = new Set();
    const adjacency = new Map();
    for (const node of dag.nodes) {
        adjacency.set(node.key, []);
    }
    for (const edge of dag.edges) {
        adjacency.get(edge.from)?.push(edge.to);
    }
    function dfs(nodeKey) {
        visited.add(nodeKey);
        recStack.add(nodeKey);
        for (const neighbor of adjacency.get(nodeKey) || []) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor))
                    return true;
            }
            else if (recStack.has(neighbor)) {
                return true;
            }
        }
        recStack.delete(nodeKey);
        return false;
    }
    for (const node of dag.nodes) {
        if (!visited.has(node.key)) {
            if (dfs(node.key))
                return true;
        }
    }
    return false;
}
function topologicalSort(dag) {
    const inDegree = new Map();
    const adjacency = new Map();
    for (const node of dag.nodes) {
        inDegree.set(node.key, 0);
        adjacency.set(node.key, []);
    }
    for (const edge of dag.edges) {
        adjacency.get(edge.from)?.push(edge.to);
        inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }
    const queue = [];
    for (const [key, degree] of inDegree) {
        if (degree === 0)
            queue.push(key);
    }
    const result = [];
    while (queue.length > 0) {
        const node = queue.shift();
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
//# sourceMappingURL=workflow.js.map