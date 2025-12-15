import { WorkflowVersionEntity, DagValidationError } from './workflow-version.entity';
import { WorkflowDag } from '@nous/shared';

describe('WorkflowVersionEntity', () => {
    const validDag: WorkflowDag = {
        nodes: [
            { key: 'trigger', type: 'manual', config: {} },
            { key: 'process', type: 'agent_task', config: {} },
            { key: 'end', type: 'output', config: {} },
        ],
        edges: [
            { from: 'trigger', to: 'process' },
            { from: 'process', to: 'end' },
        ],
    };

    describe('create', () => {
        it('should create a valid workflow version', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dagJson: validDag,
                createdBy: 'usr_789',
            });

            expect(version.id).toBe('wfv_123');
            expect(version.workflowId).toBe('wf_456');
            expect(version.version).toBe(1);
            expect(version.status).toBe('DRAFT');
        });

        it('should throw error for cyclic DAG', () => {
            const cyclicDag: WorkflowDag = {
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

            expect(() =>
                WorkflowVersionEntity.create({
                    id: 'wfv_123',
                    workflowId: 'wf_456',
                    version: 1,
                    dagJson: cyclicDag,
                    createdBy: 'usr_789',
                })
            ).toThrow(DagValidationError);
        });

        it('should throw error for DAG without trigger', () => {
            const noTriggerDag: WorkflowDag = {
                nodes: [{ key: 'a', type: 'agent_task', config: {} }],
                edges: [],
            };

            expect(() =>
                WorkflowVersionEntity.create({
                    id: 'wfv_123',
                    workflowId: 'wf_456',
                    version: 1,
                    dagJson: noTriggerDag,
                    createdBy: 'usr_789',
                })
            ).toThrow(DagValidationError);
        });
    });

    describe('publish', () => {
        it('should transition from DRAFT to PUBLISHED', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dagJson: validDag,
                createdBy: 'usr_789',
            });

            const published = version.publish();

            expect(published.status).toBe('PUBLISHED');
        });

        it('should throw error when publishing already published version', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dagJson: validDag,
                createdBy: 'usr_789',
            });

            const published = version.publish();

            expect(() => published.publish()).toThrow('Only draft versions can be published');
        });
    });

    describe('archive', () => {
        it('should transition from PUBLISHED to ARCHIVED', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dagJson: validDag,
                createdBy: 'usr_789',
            });

            const archived = version.publish().archive();

            expect(archived.status).toBe('ARCHIVED');
        });

        it('should throw error when archiving already archived version', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dagJson: validDag,
                createdBy: 'usr_789',
            });

            const archived = version.publish().archive();

            expect(() => archived.archive()).toThrow('already archived');
        });
    });

    describe('getNodeCount', () => {
        it('should return correct node count', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dagJson: validDag,
                createdBy: 'usr_789',
            });

            expect(version.getNodeCount()).toBe(3);
        });
    });

    describe('getNodeByKey', () => {
        it('should return the node with matching key', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dagJson: validDag,
                createdBy: 'usr_789',
            });

            const node = version.getNodeByKey('trigger');

            expect(node?.type).toBe('manual');
        });

        it('should return undefined for non-existent key', () => {
            const version = WorkflowVersionEntity.create({
                id: 'wfv_123',
                workflowId: 'wf_456',
                version: 1,
                dagJson: validDag,
                createdBy: 'usr_789',
            });

            const node = version.getNodeByKey('nonexistent');

            expect(node).toBeUndefined();
        });
    });
});
