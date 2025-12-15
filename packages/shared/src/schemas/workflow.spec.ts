import {
    validateDag,
    topologicalSort,
    WorkflowDagSchema,
    WorkflowDag,
} from './workflow';

describe('WorkflowDag', () => {
    describe('validateDag', () => {
        it('should return valid for acyclic DAG', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'a', type: 'trigger', config: {} },
                    { key: 'b', type: 'action', config: {} },
                    { key: 'c', type: 'action', config: {} },
                ],
                edges: [
                    { from: 'a', to: 'b' },
                    { from: 'b', to: 'c' },
                ],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect cycles', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'a', type: 'action', config: {} },
                    { key: 'b', type: 'action', config: {} },
                ],
                edges: [
                    { from: 'a', to: 'b' },
                    { from: 'b', to: 'a' },
                ],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('DAG contains a cycle');
        });

        it('should detect invalid edge references', () => {
            const dag: WorkflowDag = {
                nodes: [{ key: 'a', type: 'action', config: {} }],
                edges: [{ from: 'a', to: 'nonexistent' }],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(false);
            expect(result.errors.some((e) => e.includes('nonexistent'))).toBe(true);
        });

        it('should detect duplicate node keys', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'a', type: 'action', config: {} },
                    { key: 'a', type: 'action', config: {} },
                ],
                edges: [],
            };

            const result = validateDag(dag);

            expect(result.valid).toBe(false);
            expect(result.errors.some((e) => e.includes('Duplicate'))).toBe(true);
        });
    });

    describe('topologicalSort', () => {
        it('should return nodes in topological order', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'c', type: 'action', config: {} },
                    { key: 'a', type: 'trigger', config: {} },
                    { key: 'b', type: 'action', config: {} },
                ],
                edges: [
                    { from: 'a', to: 'b' },
                    { from: 'b', to: 'c' },
                ],
            };

            const sorted = topologicalSort(dag);

            expect(sorted).toEqual(['a', 'b', 'c']);
        });

        it('should handle diamond dependencies', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'a', type: 'trigger', config: {} },
                    { key: 'b', type: 'action', config: {} },
                    { key: 'c', type: 'action', config: {} },
                    { key: 'd', type: 'action', config: {} },
                ],
                edges: [
                    { from: 'a', to: 'b' },
                    { from: 'a', to: 'c' },
                    { from: 'b', to: 'd' },
                    { from: 'c', to: 'd' },
                ],
            };

            const sorted = topologicalSort(dag);

            expect(sorted.indexOf('a')).toBeLessThan(sorted.indexOf('b'));
            expect(sorted.indexOf('a')).toBeLessThan(sorted.indexOf('c'));
            expect(sorted.indexOf('b')).toBeLessThan(sorted.indexOf('d'));
            expect(sorted.indexOf('c')).toBeLessThan(sorted.indexOf('d'));
        });

        it('should throw for cyclic DAG', () => {
            const dag: WorkflowDag = {
                nodes: [
                    { key: 'a', type: 'action', config: {} },
                    { key: 'b', type: 'action', config: {} },
                ],
                edges: [
                    { from: 'a', to: 'b' },
                    { from: 'b', to: 'a' },
                ],
            };

            expect(() => topologicalSort(dag)).toThrow();
        });
    });

    describe('WorkflowDagSchema', () => {
        it('should validate correct DAG', () => {
            const dag = {
                nodes: [{ key: 'start', type: 'trigger', config: {} }],
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
