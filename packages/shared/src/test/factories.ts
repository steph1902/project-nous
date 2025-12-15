/**
 * Test factories for generating realistic test data
 */

// Simple random ID generator for tests (doesn't need crypto)
function randomId(): string {
    return Math.random().toString(36).substring(2, 15);
}

// ID factories
export const createOrgId = () => `org_${randomId()}`;
export const createUserId = () => `usr_${randomId()}`;
export const createWorkflowId = () => `wf_${randomId()}`;
export const createWorkflowVersionId = () => `wfv_${randomId()}`;
export const createRunId = () => `run_${randomId()}`;
export const createRunNodeId = () => `rn_${randomId()}`;
export const createCandidateId = () => `cand_${randomId()}`;
export const createSubmissionId = () => `sub_${randomId()}`;

// Entity factories
export interface OrgFactory {
    id: string;
    name: string;
    createdAt: Date;
}

export function createOrg(overrides: Partial<OrgFactory> = {}): OrgFactory {
    return {
        id: createOrgId(),
        name: `Test Org ${randomId()}`,
        createdAt: new Date(),
        ...overrides,
    };
}

export interface UserFactory {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}

export function createUser(overrides: Partial<UserFactory> = {}): UserFactory {
    const id = randomId();
    return {
        id: createUserId(),
        email: `user-${id}@test.com`,
        name: `Test User ${id}`,
        createdAt: new Date(),
        ...overrides,
    };
}

export interface WorkflowFactory {
    id: string;
    orgId: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: Date;
}

export function createWorkflow(
    orgId: string,
    createdBy: string,
    overrides: Partial<WorkflowFactory> = {}
): WorkflowFactory {
    return {
        id: createWorkflowId(),
        orgId,
        name: `Test Workflow ${randomId()}`,
        description: 'A test workflow',
        createdBy,
        createdAt: new Date(),
        ...overrides,
    };
}

// Minimal valid DAG for testing
export function createMinimalDag() {
    return {
        nodes: [
            { key: 'trigger', type: 'manual' as const, config: {} },
            { key: 'task', type: 'agent_task' as const, config: {} },
        ],
        edges: [{ from: 'trigger', to: 'task' }],
    };
}

// HR Scoring DAG template
export function createHrScoringDag() {
    return {
        nodes: [
            { key: 'trigger', type: 'manual' as const, config: {} },
            {
                key: 'rag_rubric',
                type: 'rag_query' as const,
                config: { query: 'interview rubric', topK: 5 },
            },
            {
                key: 'score',
                type: 'agent_task' as const,
                config: { promptTemplate: 'hr_score_v1' },
            },
            {
                key: 'notify',
                type: 'tool_slack' as const,
                config: { channel: '#hr' },
            },
        ],
        edges: [
            { from: 'trigger', to: 'rag_rubric' },
            { from: 'rag_rubric', to: 'score' },
            { from: 'score', to: 'notify' },
        ],
    };
}

// Candidate factory
export interface CandidateFactory {
    id: string;
    orgId: string;
    name: string;
    emailHash: string;
}

export function createCandidate(
    orgId: string,
    overrides: Partial<CandidateFactory> = {}
): CandidateFactory {
    const id = randomId();
    return {
        id: createCandidateId(),
        orgId,
        name: `Candidate ${id}`,
        emailHash: `hash_${id}`,
        ...overrides,
    };
}

// Score output factory
export function createScoreOutput(overrides: Record<string, unknown> = {}) {
    return {
        overall: 75,
        categories: {
            experience: 20,
            skills: 18,
            communication: 19,
            cultureFit: 18,
        },
        summary: 'A solid candidate with strong technical skills and good communication.',
        redFlags: [],
        ...overrides,
    };
}
