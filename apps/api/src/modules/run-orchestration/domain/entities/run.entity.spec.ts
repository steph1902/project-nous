import { RunEntity } from './run.entity';

describe('RunEntity', () => {
    describe('create', () => {
        it('should create a valid run entity in QUEUED status', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            expect(run.id).toBe('run_123');
            expect(run.status).toBe('QUEUED');
            expect(run.startedAt).toBeInstanceOf(Date);
            expect(run.finishedAt).toBeNull();
        });

        it('should accept optional inputJson', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
                inputJson: { key: 'value' },
            });

            expect(run.inputJson).toEqual({ key: 'value' });
        });

        it('should default inputJson to empty object', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            expect(run.inputJson).toEqual({});
        });
    });

    describe('state transitions', () => {
        it('should transition from QUEUED to RUNNING', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const running = run.start();

            expect(running.status).toBe('RUNNING');
        });

        it('should transition from RUNNING to SUCCEEDED', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const succeeded = run.start().succeed({ result: 'ok' });

            expect(succeeded.status).toBe('SUCCEEDED');
            expect(succeeded.finishedAt).toBeInstanceOf(Date);
            expect(succeeded.outputJson).toEqual({ result: 'ok' });
        });

        it('should transition from RUNNING to FAILED', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const failed = run.start().fail();

            expect(failed.status).toBe('FAILED');
            expect(failed.finishedAt).toBeInstanceOf(Date);
        });

        it('should transition to CANCELED from QUEUED', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const canceled = run.cancel();

            expect(canceled.status).toBe('CANCELED');
            expect(canceled.finishedAt).toBeInstanceOf(Date);
        });

        it('should throw error when transitioning from terminal state', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const succeeded = run.start().succeed({});

            expect(() => succeeded.cancel()).toThrow('Invalid run state transition');
        });
    });

    describe('isTerminal', () => {
        it('should return false for QUEUED', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            expect(run.isTerminal()).toBe(false);
        });

        it('should return true for SUCCEEDED', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            expect(run.start().succeed({}).isTerminal()).toBe(true);
        });
    });

    describe('getDurationMs', () => {
        it('should return null for running job', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            expect(run.getDurationMs()).toBeNull();
        });

        it('should return duration for finished job', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const finished = run.start().succeed({});

            expect(finished.getDurationMs()).toBeGreaterThanOrEqual(0);
        });
    });
});
