import { WorkflowEntity } from './workflow.entity';

describe('WorkflowEntity', () => {
    describe('create', () => {
        it('should create a valid workflow entity', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Test Workflow',
                description: 'A test workflow',
            });

            expect(workflow.id).toBe('wf_123');
            expect(workflow.orgId).toBe('org_456');
            expect(workflow.name).toBe('Test Workflow');
            expect(workflow.description).toBe('A test workflow');
            expect(workflow.createdAt).toBeInstanceOf(Date);
        });

        it('should throw error for empty name', () => {
            expect(() =>
                WorkflowEntity.create({
                    id: 'wf_123',
                    orgId: 'org_456',
                    name: '',
                })
            ).toThrow('Workflow name cannot be empty');
        });

        it('should allow empty description', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Test Workflow',
            });

            expect(workflow.description).toBeUndefined();
        });
    });

    describe('rename', () => {
        it('should return a new entity with updated name', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Old Name',
            });

            const renamed = workflow.rename('New Name');

            expect(renamed.name).toBe('New Name');
            expect(renamed.id).toBe(workflow.id);
        });
    });

    describe('updateDescription', () => {
        it('should return a new entity with updated description', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Test',
                description: 'Old description',
            });

            const updated = workflow.updateDescription('New description');

            expect(updated.description).toBe('New description');
        });
    });
});
