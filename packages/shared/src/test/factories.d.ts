export declare const createOrgId: () => string;
export declare const createUserId: () => string;
export declare const createWorkflowId: () => string;
export declare const createWorkflowVersionId: () => string;
export declare const createRunId: () => string;
export declare const createRunNodeId: () => string;
export declare const createCandidateId: () => string;
export declare const createSubmissionId: () => string;
export interface OrgFactory {
    id: string;
    name: string;
    createdAt: Date;
}
export declare function createOrg(overrides?: Partial<OrgFactory>): OrgFactory;
export interface UserFactory {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}
export declare function createUser(overrides?: Partial<UserFactory>): UserFactory;
export interface WorkflowFactory {
    id: string;
    orgId: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: Date;
}
export declare function createWorkflow(orgId: string, createdBy: string, overrides?: Partial<WorkflowFactory>): WorkflowFactory;
export declare function createMinimalDag(): {
    nodes: ({
        key: string;
        type: "manual";
        config: {};
    } | {
        key: string;
        type: "agent_task";
        config: {};
    })[];
    edges: {
        from: string;
        to: string;
    }[];
};
export declare function createHrScoringDag(): {
    nodes: ({
        key: string;
        type: "manual";
        config: {
            query?: undefined;
            topK?: undefined;
            promptTemplate?: undefined;
            channel?: undefined;
        };
    } | {
        key: string;
        type: "rag_query";
        config: {
            query: string;
            topK: number;
            promptTemplate?: undefined;
            channel?: undefined;
        };
    } | {
        key: string;
        type: "agent_task";
        config: {
            promptTemplate: string;
            query?: undefined;
            topK?: undefined;
            channel?: undefined;
        };
    } | {
        key: string;
        type: "tool_slack";
        config: {
            channel: string;
            query?: undefined;
            topK?: undefined;
            promptTemplate?: undefined;
        };
    })[];
    edges: {
        from: string;
        to: string;
    }[];
};
export interface CandidateFactory {
    id: string;
    orgId: string;
    name: string;
    emailHash: string;
}
export declare function createCandidate(orgId: string, overrides?: Partial<CandidateFactory>): CandidateFactory;
export declare function createScoreOutput(overrides?: Record<string, unknown>): {
    overall: number;
    categories: {
        experience: number;
        skills: number;
        communication: number;
        cultureFit: number;
    };
    summary: string;
    redFlags: never[];
};
//# sourceMappingURL=factories.d.ts.map