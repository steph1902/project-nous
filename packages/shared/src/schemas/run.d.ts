import { z } from 'zod';
export declare const RunStatusSchema: z.ZodEnum<["QUEUED", "RUNNING", "SUCCEEDED", "FAILED", "CANCELED"]>;
export type RunStatus = z.infer<typeof RunStatusSchema>;
export declare const NodeStatusSchema: z.ZodEnum<["QUEUED", "RUNNING", "SUCCEEDED", "FAILED", "SKIPPED"]>;
export type NodeStatus = z.infer<typeof NodeStatusSchema>;
export declare const RUN_TRANSITIONS: Record<RunStatus, RunStatus[]>;
export declare const NODE_TRANSITIONS: Record<NodeStatus, NodeStatus[]>;
export declare function canTransitionRun(from: RunStatus, to: RunStatus): boolean;
export declare function canTransitionNode(from: NodeStatus, to: NodeStatus): boolean;
export declare const StartRunInputSchema: z.ZodObject<{
    workflowId: z.ZodString;
    input: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    idempotencyKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    workflowId: string;
    input: Record<string, unknown>;
    idempotencyKey?: string | undefined;
}, {
    workflowId: string;
    idempotencyKey?: string | undefined;
    input?: Record<string, unknown> | undefined;
}>;
export type StartRunInput = z.infer<typeof StartRunInputSchema>;
export declare const RunOutputSchema: z.ZodObject<{
    runId: z.ZodString;
    status: z.ZodEnum<["QUEUED", "RUNNING", "SUCCEEDED", "FAILED", "CANCELED"]>;
    output: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    startedAt: z.ZodString;
    finishedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELED";
    runId: string;
    startedAt: string;
    output?: Record<string, unknown> | undefined;
    finishedAt?: string | undefined;
}, {
    status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELED";
    runId: string;
    startedAt: string;
    output?: Record<string, unknown> | undefined;
    finishedAt?: string | undefined;
}>;
export type RunOutput = z.infer<typeof RunOutputSchema>;
export declare const NodeExecutionResultSchema: z.ZodObject<{
    nodeKey: z.ZodString;
    status: z.ZodEnum<["QUEUED", "RUNNING", "SUCCEEDED", "FAILED", "SKIPPED"]>;
    output: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
    }, {
        code: string;
        message: string;
    }>>;
    attempts: z.ZodNumber;
    durationMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "SKIPPED";
    nodeKey: string;
    attempts: number;
    output?: Record<string, unknown> | undefined;
    error?: {
        code: string;
        message: string;
    } | undefined;
    durationMs?: number | undefined;
}, {
    status: "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED" | "SKIPPED";
    nodeKey: string;
    attempts: number;
    output?: Record<string, unknown> | undefined;
    error?: {
        code: string;
        message: string;
    } | undefined;
    durationMs?: number | undefined;
}>;
export type NodeExecutionResult = z.infer<typeof NodeExecutionResultSchema>;
//# sourceMappingURL=run.d.ts.map