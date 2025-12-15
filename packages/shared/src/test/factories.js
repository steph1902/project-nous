"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmissionId = exports.createCandidateId = exports.createRunNodeId = exports.createRunId = exports.createWorkflowVersionId = exports.createWorkflowId = exports.createUserId = exports.createOrgId = void 0;
exports.createOrg = createOrg;
exports.createUser = createUser;
exports.createWorkflow = createWorkflow;
exports.createMinimalDag = createMinimalDag;
exports.createHrScoringDag = createHrScoringDag;
exports.createCandidate = createCandidate;
exports.createScoreOutput = createScoreOutput;
function randomId() {
    return Math.random().toString(36).substring(2, 15);
}
const createOrgId = () => `org_${randomId()}`;
exports.createOrgId = createOrgId;
const createUserId = () => `usr_${randomId()}`;
exports.createUserId = createUserId;
const createWorkflowId = () => `wf_${randomId()}`;
exports.createWorkflowId = createWorkflowId;
const createWorkflowVersionId = () => `wfv_${randomId()}`;
exports.createWorkflowVersionId = createWorkflowVersionId;
const createRunId = () => `run_${randomId()}`;
exports.createRunId = createRunId;
const createRunNodeId = () => `rn_${randomId()}`;
exports.createRunNodeId = createRunNodeId;
const createCandidateId = () => `cand_${randomId()}`;
exports.createCandidateId = createCandidateId;
const createSubmissionId = () => `sub_${randomId()}`;
exports.createSubmissionId = createSubmissionId;
function createOrg(overrides = {}) {
    return {
        id: (0, exports.createOrgId)(),
        name: `Test Org ${randomId()}`,
        createdAt: new Date(),
        ...overrides,
    };
}
function createUser(overrides = {}) {
    const id = randomId();
    return {
        id: (0, exports.createUserId)(),
        email: `user-${id}@test.com`,
        name: `Test User ${id}`,
        createdAt: new Date(),
        ...overrides,
    };
}
function createWorkflow(orgId, createdBy, overrides = {}) {
    return {
        id: (0, exports.createWorkflowId)(),
        orgId,
        name: `Test Workflow ${randomId()}`,
        description: 'A test workflow',
        createdBy,
        createdAt: new Date(),
        ...overrides,
    };
}
function createMinimalDag() {
    return {
        nodes: [
            { key: 'trigger', type: 'manual', config: {} },
            { key: 'task', type: 'agent_task', config: {} },
        ],
        edges: [{ from: 'trigger', to: 'task' }],
    };
}
function createHrScoringDag() {
    return {
        nodes: [
            { key: 'trigger', type: 'manual', config: {} },
            {
                key: 'rag_rubric',
                type: 'rag_query',
                config: { query: 'interview rubric', topK: 5 },
            },
            {
                key: 'score',
                type: 'agent_task',
                config: { promptTemplate: 'hr_score_v1' },
            },
            {
                key: 'notify',
                type: 'tool_slack',
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
function createCandidate(orgId, overrides = {}) {
    const id = randomId();
    return {
        id: (0, exports.createCandidateId)(),
        orgId,
        name: `Candidate ${id}`,
        emailHash: `hash_${id}`,
        ...overrides,
    };
}
function createScoreOutput(overrides = {}) {
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
//# sourceMappingURL=factories.js.map