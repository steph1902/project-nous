import { z } from 'zod';
export declare const NodeTypeSchema: z.ZodEnum<["manual", "webhook", "schedule", "agent_task", "tool_http", "tool_slack", "tool_gmail", "tool_sheets", "rag_query", "transform", "human_approval", "output"]>;
export type NodeType = z.infer<typeof NodeTypeSchema>;
export declare const RetryPolicySchema: z.ZodObject<{
    maxAttempts: z.ZodDefault<z.ZodNumber>;
    backoffMs: z.ZodDefault<z.ZodNumber>;
    retryOn: z.ZodDefault<z.ZodArray<z.ZodEnum<["timeout", "429", "5xx"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    maxAttempts: number;
    backoffMs: number;
    retryOn: ("timeout" | "429" | "5xx")[];
}, {
    maxAttempts?: number | undefined;
    backoffMs?: number | undefined;
    retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
}>;
export type RetryPolicy = z.infer<typeof RetryPolicySchema>;
export declare const DagNodeSchema: z.ZodObject<{
    key: z.ZodString;
    type: z.ZodEnum<["manual", "webhook", "schedule", "agent_task", "tool_http", "tool_slack", "tool_gmail", "tool_sheets", "rag_query", "transform", "human_approval", "output"]>;
    config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    retryPolicy: z.ZodOptional<z.ZodObject<{
        maxAttempts: z.ZodDefault<z.ZodNumber>;
        backoffMs: z.ZodDefault<z.ZodNumber>;
        retryOn: z.ZodDefault<z.ZodArray<z.ZodEnum<["timeout", "429", "5xx"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        maxAttempts: number;
        backoffMs: number;
        retryOn: ("timeout" | "429" | "5xx")[];
    }, {
        maxAttempts?: number | undefined;
        backoffMs?: number | undefined;
        retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
    }>>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
    key: string;
    config: Record<string, unknown>;
    timeoutMs?: number | undefined;
    retryPolicy?: {
        maxAttempts: number;
        backoffMs: number;
        retryOn: ("timeout" | "429" | "5xx")[];
    } | undefined;
    permissions?: string[] | undefined;
}, {
    type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
    key: string;
    config?: Record<string, unknown> | undefined;
    timeoutMs?: number | undefined;
    retryPolicy?: {
        maxAttempts?: number | undefined;
        backoffMs?: number | undefined;
        retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
    } | undefined;
    permissions?: string[] | undefined;
}>;
export type DagNode = z.infer<typeof DagNodeSchema>;
export declare const DagEdgeSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    condition: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    condition?: string | undefined;
}, {
    from: string;
    to: string;
    condition?: string | undefined;
}>;
export type DagEdge = z.infer<typeof DagEdgeSchema>;
export declare const WorkflowDagSchema: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        type: z.ZodEnum<["manual", "webhook", "schedule", "agent_task", "tool_http", "tool_slack", "tool_gmail", "tool_sheets", "rag_query", "transform", "human_approval", "output"]>;
        config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        retryPolicy: z.ZodOptional<z.ZodObject<{
            maxAttempts: z.ZodDefault<z.ZodNumber>;
            backoffMs: z.ZodDefault<z.ZodNumber>;
            retryOn: z.ZodDefault<z.ZodArray<z.ZodEnum<["timeout", "429", "5xx"]>, "many">>;
        }, "strip", z.ZodTypeAny, {
            maxAttempts: number;
            backoffMs: number;
            retryOn: ("timeout" | "429" | "5xx")[];
        }, {
            maxAttempts?: number | undefined;
            backoffMs?: number | undefined;
            retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
        }>>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
        key: string;
        config: Record<string, unknown>;
        timeoutMs?: number | undefined;
        retryPolicy?: {
            maxAttempts: number;
            backoffMs: number;
            retryOn: ("timeout" | "429" | "5xx")[];
        } | undefined;
        permissions?: string[] | undefined;
    }, {
        type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
        key: string;
        config?: Record<string, unknown> | undefined;
        timeoutMs?: number | undefined;
        retryPolicy?: {
            maxAttempts?: number | undefined;
            backoffMs?: number | undefined;
            retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
        } | undefined;
        permissions?: string[] | undefined;
    }>, "many">;
    edges: z.ZodArray<z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
        condition: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        to: string;
        condition?: string | undefined;
    }, {
        from: string;
        to: string;
        condition?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    nodes: {
        type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
        key: string;
        config: Record<string, unknown>;
        timeoutMs?: number | undefined;
        retryPolicy?: {
            maxAttempts: number;
            backoffMs: number;
            retryOn: ("timeout" | "429" | "5xx")[];
        } | undefined;
        permissions?: string[] | undefined;
    }[];
    edges: {
        from: string;
        to: string;
        condition?: string | undefined;
    }[];
}, {
    nodes: {
        type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
        key: string;
        config?: Record<string, unknown> | undefined;
        timeoutMs?: number | undefined;
        retryPolicy?: {
            maxAttempts?: number | undefined;
            backoffMs?: number | undefined;
            retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
        } | undefined;
        permissions?: string[] | undefined;
    }[];
    edges: {
        from: string;
        to: string;
        condition?: string | undefined;
    }[];
}>;
export type WorkflowDag = z.infer<typeof WorkflowDagSchema>;
export declare const WorkflowVersionStatusSchema: z.ZodEnum<["DRAFT", "PUBLISHED", "ARCHIVED"]>;
export type WorkflowVersionStatus = z.infer<typeof WorkflowVersionStatusSchema>;
export declare const TriggerTypeSchema: z.ZodEnum<["MANUAL", "WEBHOOK", "SCHEDULE"]>;
export type TriggerType = z.infer<typeof TriggerTypeSchema>;
export declare const CreateWorkflowInputSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export type CreateWorkflowInput = z.infer<typeof CreateWorkflowInputSchema>;
export declare const PublishWorkflowVersionInputSchema: z.ZodObject<{
    dag: z.ZodObject<{
        nodes: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            type: z.ZodEnum<["manual", "webhook", "schedule", "agent_task", "tool_http", "tool_slack", "tool_gmail", "tool_sheets", "rag_query", "transform", "human_approval", "output"]>;
            config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            retryPolicy: z.ZodOptional<z.ZodObject<{
                maxAttempts: z.ZodDefault<z.ZodNumber>;
                backoffMs: z.ZodDefault<z.ZodNumber>;
                retryOn: z.ZodDefault<z.ZodArray<z.ZodEnum<["timeout", "429", "5xx"]>, "many">>;
            }, "strip", z.ZodTypeAny, {
                maxAttempts: number;
                backoffMs: number;
                retryOn: ("timeout" | "429" | "5xx")[];
            }, {
                maxAttempts?: number | undefined;
                backoffMs?: number | undefined;
                retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
            }>>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
            key: string;
            config: Record<string, unknown>;
            timeoutMs?: number | undefined;
            retryPolicy?: {
                maxAttempts: number;
                backoffMs: number;
                retryOn: ("timeout" | "429" | "5xx")[];
            } | undefined;
            permissions?: string[] | undefined;
        }, {
            type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
            key: string;
            config?: Record<string, unknown> | undefined;
            timeoutMs?: number | undefined;
            retryPolicy?: {
                maxAttempts?: number | undefined;
                backoffMs?: number | undefined;
                retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
            } | undefined;
            permissions?: string[] | undefined;
        }>, "many">;
        edges: z.ZodArray<z.ZodObject<{
            from: z.ZodString;
            to: z.ZodString;
            condition: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            from: string;
            to: string;
            condition?: string | undefined;
        }, {
            from: string;
            to: string;
            condition?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        nodes: {
            type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
            key: string;
            config: Record<string, unknown>;
            timeoutMs?: number | undefined;
            retryPolicy?: {
                maxAttempts: number;
                backoffMs: number;
                retryOn: ("timeout" | "429" | "5xx")[];
            } | undefined;
            permissions?: string[] | undefined;
        }[];
        edges: {
            from: string;
            to: string;
            condition?: string | undefined;
        }[];
    }, {
        nodes: {
            type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
            key: string;
            config?: Record<string, unknown> | undefined;
            timeoutMs?: number | undefined;
            retryPolicy?: {
                maxAttempts?: number | undefined;
                backoffMs?: number | undefined;
                retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
            } | undefined;
            permissions?: string[] | undefined;
        }[];
        edges: {
            from: string;
            to: string;
            condition?: string | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    dag: {
        nodes: {
            type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
            key: string;
            config: Record<string, unknown>;
            timeoutMs?: number | undefined;
            retryPolicy?: {
                maxAttempts: number;
                backoffMs: number;
                retryOn: ("timeout" | "429" | "5xx")[];
            } | undefined;
            permissions?: string[] | undefined;
        }[];
        edges: {
            from: string;
            to: string;
            condition?: string | undefined;
        }[];
    };
}, {
    dag: {
        nodes: {
            type: "manual" | "webhook" | "schedule" | "agent_task" | "tool_http" | "tool_slack" | "tool_gmail" | "tool_sheets" | "rag_query" | "transform" | "human_approval" | "output";
            key: string;
            config?: Record<string, unknown> | undefined;
            timeoutMs?: number | undefined;
            retryPolicy?: {
                maxAttempts?: number | undefined;
                backoffMs?: number | undefined;
                retryOn?: ("timeout" | "429" | "5xx")[] | undefined;
            } | undefined;
            permissions?: string[] | undefined;
        }[];
        edges: {
            from: string;
            to: string;
            condition?: string | undefined;
        }[];
    };
}>;
export type PublishWorkflowVersionInput = z.infer<typeof PublishWorkflowVersionInputSchema>;
export declare function validateDag(dag: WorkflowDag): {
    valid: boolean;
    errors: string[];
};
export declare function topologicalSort(dag: WorkflowDag): string[];
//# sourceMappingURL=workflow.d.ts.map