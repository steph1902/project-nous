import { z } from 'zod';

/**
 * Run execution schemas
 */

// Run status
export const RunStatusSchema = z.enum([
    'QUEUED',
    'RUNNING',
    'SUCCEEDED',
    'FAILED',
    'CANCELED',
]);

export type RunStatus = z.infer<typeof RunStatusSchema>;

// Node status
export const NodeStatusSchema = z.enum([
    'QUEUED',
    'RUNNING',
    'SUCCEEDED',
    'FAILED',
    'SKIPPED',
]);

export type NodeStatus = z.infer<typeof NodeStatusSchema>;

// State machine transitions
export const RUN_TRANSITIONS: Record<RunStatus, RunStatus[]> = {
    QUEUED: ['RUNNING', 'CANCELED'],
    RUNNING: ['SUCCEEDED', 'FAILED', 'CANCELED'],
    SUCCEEDED: [],
    FAILED: [],
    CANCELED: [],
};

export const NODE_TRANSITIONS: Record<NodeStatus, NodeStatus[]> = {
    QUEUED: ['RUNNING', 'SKIPPED'],
    RUNNING: ['SUCCEEDED', 'FAILED'],
    SUCCEEDED: [],
    FAILED: [],
    SKIPPED: [],
};

export function canTransitionRun(from: RunStatus, to: RunStatus): boolean {
    return RUN_TRANSITIONS[from].includes(to);
}

export function canTransitionNode(from: NodeStatus, to: NodeStatus): boolean {
    return NODE_TRANSITIONS[from].includes(to);
}

// Start run input
export const StartRunInputSchema = z.object({
    workflowId: z.string(),
    input: z.record(z.unknown()).default({}),
    idempotencyKey: z.string().optional(),
});

export type StartRunInput = z.infer<typeof StartRunInputSchema>;

// Run output
export const RunOutputSchema = z.object({
    runId: z.string(),
    status: RunStatusSchema,
    output: z.record(z.unknown()).optional(),
    startedAt: z.string(),
    finishedAt: z.string().optional(),
});

export type RunOutput = z.infer<typeof RunOutputSchema>;

// Node execution result
export const NodeExecutionResultSchema = z.object({
    nodeKey: z.string(),
    status: NodeStatusSchema,
    output: z.record(z.unknown()).optional(),
    error: z
        .object({
            code: z.string(),
            message: z.string(),
        })
        .optional(),
    attempts: z.number(),
    durationMs: z.number().optional(),
});

export type NodeExecutionResult = z.infer<typeof NodeExecutionResultSchema>;
