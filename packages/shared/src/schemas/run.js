"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeExecutionResultSchema = exports.RunOutputSchema = exports.StartRunInputSchema = exports.NODE_TRANSITIONS = exports.RUN_TRANSITIONS = exports.NodeStatusSchema = exports.RunStatusSchema = void 0;
exports.canTransitionRun = canTransitionRun;
exports.canTransitionNode = canTransitionNode;
const zod_1 = require("zod");
exports.RunStatusSchema = zod_1.z.enum([
    'QUEUED',
    'RUNNING',
    'SUCCEEDED',
    'FAILED',
    'CANCELED',
]);
exports.NodeStatusSchema = zod_1.z.enum([
    'QUEUED',
    'RUNNING',
    'SUCCEEDED',
    'FAILED',
    'SKIPPED',
]);
exports.RUN_TRANSITIONS = {
    QUEUED: ['RUNNING', 'CANCELED'],
    RUNNING: ['SUCCEEDED', 'FAILED', 'CANCELED'],
    SUCCEEDED: [],
    FAILED: [],
    CANCELED: [],
};
exports.NODE_TRANSITIONS = {
    QUEUED: ['RUNNING', 'SKIPPED'],
    RUNNING: ['SUCCEEDED', 'FAILED'],
    SUCCEEDED: [],
    FAILED: [],
    SKIPPED: [],
};
function canTransitionRun(from, to) {
    return exports.RUN_TRANSITIONS[from].includes(to);
}
function canTransitionNode(from, to) {
    return exports.NODE_TRANSITIONS[from].includes(to);
}
exports.StartRunInputSchema = zod_1.z.object({
    workflowId: zod_1.z.string(),
    input: zod_1.z.record(zod_1.z.unknown()).default({}),
    idempotencyKey: zod_1.z.string().optional(),
});
exports.RunOutputSchema = zod_1.z.object({
    runId: zod_1.z.string(),
    status: exports.RunStatusSchema,
    output: zod_1.z.record(zod_1.z.unknown()).optional(),
    startedAt: zod_1.z.string(),
    finishedAt: zod_1.z.string().optional(),
});
exports.NodeExecutionResultSchema = zod_1.z.object({
    nodeKey: zod_1.z.string(),
    status: exports.NodeStatusSchema,
    output: zod_1.z.record(zod_1.z.unknown()).optional(),
    error: zod_1.z
        .object({
        code: zod_1.z.string(),
        message: zod_1.z.string(),
    })
        .optional(),
    attempts: zod_1.z.number(),
    durationMs: zod_1.z.number().optional(),
});
//# sourceMappingURL=run.js.map