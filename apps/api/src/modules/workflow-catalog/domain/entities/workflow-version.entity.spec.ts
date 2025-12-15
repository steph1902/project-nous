import { WorkflowVersionEntity, WorkflowVersionStatus } from './workflow-version.entity';
import { WorkflowDag } from '@nous/shared';

describe('WorkflowVersionEntity', () => {
    const validDag: WorkflowDag = {
        nodes: [
            { key: 'start', type: 'trigger', config: {} },
            { key: 'process', type: 'action', config: {} },
            { key: 'end', type: 'action', config: {} },
        ],
        edges: [
            { from: 'start', to: 'process' },
            { from: 'process', to: 'end' },
        ],
    };

    describe('create', () => {
        it('should create a valid workflow version', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dag: validDag,
            });

            expect(version.id).toBe('wfv_123');
            expect(version.workflowId).toBe('wf_456');
            expect(version.version).toBe(1);
            expect(version.status).toBe(WorkflowVersionStatus.DRAFT);
        });

        it('should throw error for empty DAG nodes', () => {
            expect(() =>
                WorkflowVersionEntity.create({
                    id: 'wfv_123',
                    workflowId: 'wf_456',
                    version: 1,
                    dag: { nodes: [], edges: [] },
                })
            ).toThrow('DAG must have at least one node');
        });

        it('should throw error for cyclic DAG', () => {
            const cyclicDag: WorkflowDag = {
                nodes: [
                    { key: 'a', type: 'action', config: {} },
                    { key: 'b', type: 'action', config: {} },
                ],
                edges: [
                    { from: 'a', to: 'b' },
                    { from: 'b', to: 'a' },
                ],
            };

            expect(() =>
                WorkflowVersionEntity.create({
                    id: 'wfv_123',
                    workflowId: 'wf_456',
                    version: 1,
                    dag: cyclicDag,
                })
            ).toThrow('DAG contains a cycle');
        });
    });

    describe('publish', () => {
        it('should transition from DRAFT to PUBLISHED', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dag: validDag,
            });

            const published = version.publish();

            expect(published.status).toBe(WorkflowVersionStatus.PUBLISHED);
            expect(published.publishedAt).toBeInstanceOf(Date);
        });

        it('should throw error when publishing already published version', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dag: validDag,
            });

            const published = version.publish();

            expect(() => published.publish()).toThrow('Cannot publish');
        });
    });

    describe('archive', () => {
        it('should transition from PUBLISHED to ARCHIVED', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dag: validDag,
            });

            const archived = version.publish().archive();

            expect(archived.status).toBe(WorkflowVersionStatus.ARCHIVED);
        });

        it('should throw error when archiving DRAFT version', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dag: validDag,
            });

            expect(() => version.archive()).toThrow('Cannot archive');
        });
    });

    describe('getNodeCount', () => {
        it('should return correct node count', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dag: validDag,
            });

            expect(version.getNodeCount()).toBe(3);
        });
    });
});
