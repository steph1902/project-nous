import { WorkflowEntity } from './workflow.entity';

describe('WorkflowEntity', () => {
    describe('create', () => {
        it('should create a valid workflow entity', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Test Workflow',
                description: 'A test workflow',
                createdBy: 'usr_789',
            });

            expect(workflow.id).toBe('wf_123');
            expect(workflow.orgId).toBe('org_456');
            expect(workflow.name).toBe('Test Workflow');
            expect(workflow.description).toBe('A test workflow');
            expect(workflow.createdBy).toBe('usr_789');
            expect(workflow.createdAt).toBeInstanceOf(Date);
        });

        it('should throw error for empty name', () => {
            expect(() =>
                WorkflowEntity.create({
                    id: 'wf_123',
                    orgId: 'org_456',
                    name: '',
                    createdBy: 'usr_789',
                })
            ).toThrow('Workflow name cannot be empty');
        });

        it('should allow undefined description', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Test Workflow',
                createdBy: 'usr_789',
            });

            expect(workflow.description).toBeNull();
        });

        it('should trim whitespace from name', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: '  Test Workflow  ',
                createdBy: 'usr_789',
            });

            expect(workflow.name).toBe('Test Workflow');
        });
    });

    describe('rename', () => {
        it('should return a new entity with updated name', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Old Name',
                createdBy: 'usr_789',
            });

            const renamed = workflow.rename('New Name');

            expect(renamed.name).toBe('New Name');
            expect(renamed.id).toBe(workflow.id);
        });

        it('should throw error for empty new name', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Old Name',
                createdBy: 'usr_789',
            });

            expect(() => workflow.rename('')).toThrow('Workflow name cannot be empty');
        });
    });

    describe('updateDescription', () => {
        it('should return a new entity with updated description', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Test',
                description: 'Old description',
                createdBy: 'usr_789',
            });

            const updated = workflow.updateDescription('New description');

            expect(updated.description).toBe('New description');
        });

        it('should set description to null when passed null', () => {
            const workflow = WorkflowEntity.create({
                id: 'wf_123',
                orgId: 'org_456',
                name: 'Test',
                description: 'Old description',
                createdBy: 'usr_789',
            });

            const updated = workflow.updateDescription(null);

            expect(updated.description).toBeNull();
        });
    });
});
