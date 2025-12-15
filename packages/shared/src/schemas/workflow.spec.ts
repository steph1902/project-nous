import {
    validateDag,
    topologicalSort,
    WorkflowDagSchema,
    WorkflowDag,
} from './workflow';

describe('WorkflowDag', () => {
    describe('validateDag', () => {
        it('should return valid for acyclic DAG with trigger', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'trigger', type: 'manual', config: {} },
                    { key: 'process', type: 'agent_task', config: {} },
                    { key: 'output', type: 'output', config: {} },
                ],
                edges: [
                    { from: 'trigger', to: 'process' },
                    { from: 'process', to: 'output' },
                ],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect cycles', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'trigger', type: 'manual', config: {} },
                    { key: 'a', type: 'agent_task', config: {} },
                    { key: 'b', type: 'agent_task', config: {} },
                ],
                edges: [
                    { from: 'trigger', to: 'a' },
                    { from: 'a', to: 'b' },
                    { from: 'b', to: 'a' },
                ],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Workflow contains a cycle');
        });

        it('should require a trigger node', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'a', type: 'agent_task', config: {} },
                ],
                edges: [],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Workflow must have at least one trigger node');
        });

        it('should detect invalid edge references', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'trigger', type: 'manual', config: {} },
                ],
                edges: [{ from: 'trigger', to: 'nonexistent' }],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(false);
            expect(result.errors.some((e) => e.includes('nonexistent'))).toBe(true);
        });

        it('should detect duplicate node keys', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'trigger', type: 'manual', config: {} },
                    { key: 'trigger', type: 'agent_task', config: {} },
                ],
                edges: [],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(false);
            expect(result.errors.some((e) => e.includes('unique'))).toBe(true);
        });
    });

    describe('topologicalSort', () => {
        it('should return nodes in topological order', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'output', type: 'output', config: {} },
                    { key: 'trigger', type: 'manual', config: {} },
                    { key: 'process', type: 'agent_task', config: {} },
                ],
                edges: [
                    { from: 'trigger', to: 'process' },
                    { from: 'process', to: 'output' },
                ],
            };

            const sorted = topologicalSort(dag);

            expect(sorted).toEqual(['trigger', 'process', 'output']);
        });

        it('should handle diamond dependencies', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'trigger', type: 'manual', config: {} },
                    { key: 'b', type: 'agent_task', config: {} },
                    { key: 'c', type: 'agent_task', config: {} },
                    { key: 'd', type: 'output', config: {} },
                ],
                edges: [
                    { from: 'trigger', to: 'b' },
                    { from: 'trigger', to: 'c' },
                    { from: 'b', to: 'd' },
                    { from: 'c', to: 'd' },
                ],
            };

            const sorted = topologicalSort(dag);

            expect(sorted.indexOf('trigger')).toBeLessThan(sorted.indexOf('b'));
            expect(sorted.indexOf('trigger')).toBeLessThan(sorted.indexOf('c'));
            expect(sorted.indexOf('b')).toBeLessThan(sorted.indexOf('d'));
            expect(sorted.indexOf('c')).toBeLessThan(sorted.indexOf('d'));
        });

        it('should handle cyclic DAG gracefully (returns incomplete result)', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'a', type: 'agent_task', config: {} },
                    { key: 'b', type: 'agent_task', config: {} },
                ],
                edges: [
                    { from: 'a', to: 'b' },
                    { from: 'b', to: 'a' },
                ],
            };

            // Cyclic DAG will return incomplete result (not all nodes)
            const sorted = topologicalSort(dag);
            expect(sorted.length).toBeLessThan(dag.nodes.length);
        });
    });

    describe('WorkflowDagSchema', () => {
        it('should validate correct DAG', () => {
            const dag = {
                nodes: [{ key: 'start', type: 'manual', config: {} }],
                edges: [],
            };

            const result = WorkflowDagSchema.safeParse(dag);

            expect(result.success).toBe(true);
        });

        it('should reject invalid node type', () => {
            const dag = {
                nodes: [{ key: 'start', type: 'invalid_type', config: {} }],
                edges: [],
            };

            const result = WorkflowDagSchema.safeParse(dag);

            expect(result.success).toBe(false);
        });
    });
});
