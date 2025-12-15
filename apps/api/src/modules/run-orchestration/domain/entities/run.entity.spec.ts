import { RunEntity, RunStatus } from './run.entity';

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
            expect(run.status).toBe(RunStatus.QUEUED);
            expect(run.startedAt).toBeInstanceOf(Date);
            expect(run.finishedAt).toBeNull();
        });

        it('should accept optional idempotency key', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
                idempotencyKey: 'idem_xyz',
            });

            expect(run.idempotencyKey).toBe('idem_xyz');
        });

        it('should accept optional input', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
                input: { key: 'value' },
            });

            expect(run.input).toEqual({ key: 'value' });
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

            expect(running.status).toBe(RunStatus.RUNNING);
        });

        it('should transition from RUNNING to SUCCEEDED', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const succeeded = run.start().succeed({ result: 'ok' });

            expect(succeeded.status).toBe(RunStatus.SUCCEEDED);
            expect(succeeded.finishedAt).toBeInstanceOf(Date);
            expect(succeeded.output).toEqual({ result: 'ok' });
        });

        it('should transition from RUNNING to FAILED', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const failed = run.start().fail({ error: 'Something went wrong' });

            expect(failed.status).toBe(RunStatus.FAILED);
            expect(failed.finishedAt).toBeInstanceOf(Date);
            expect(failed.error).toEqual({ error: 'Something went wrong' });
        });

        it('should transition to CANCELED from non-terminal state', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const canceled = run.cancel();

            expect(canceled.status).toBe(RunStatus.CANCELED);
            expect(canceled.finishedAt).toBeInstanceOf(Date);
        });

        it('should throw error when canceling from terminal state', () => {
            const run = RunEntity.create({
                id: 'run_123',
                orgId: 'org_456',
                workflowVersionId: 'wfv_789',
                initiatedBy: 'usr_abc',
            });

            const succeeded = run.start().succeed({});

            expect(() => succeeded.cancel()).toThrow('Cannot transition');
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
});
