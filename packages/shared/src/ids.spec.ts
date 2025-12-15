import {
    generateUserId,
    generateOrgId,
    generateWorkflowId,
    generateRunId,
    parseIdPrefix,
    validateIdPrefix,
} from './ids';

describe('ID Generation', () => {
    describe('generateUserId', () => {
        it('should generate ID with usr_ prefix', () => {
            const id = generateUserId();
            expect(id).toMatch(/^usr_[a-f0-9]{24}$/);
        });

        it('should generate unique IDs', () => {
            const id1 = generateUserId();
            const id2 = generateUserId();
            expect(id1).not.toBe(id2);
        });
    });

    describe('generateOrgId', () => {
        it('should generate ID with org_ prefix', () => {
            const id = generateOrgId();
            expect(id).toMatch(/^org_[a-f0-9]{24}$/);
        });
    });

    describe('generateWorkflowId', () => {
        it('should generate ID with wf_ prefix', () => {
            const id = generateWorkflowId();
            expect(id).toMatch(/^wf_[a-f0-9]{24}$/);
        });
    });

    describe('generateRunId', () => {
        it('should generate ID with run_ prefix', () => {
            const id = generateRunId();
            expect(id).toMatch(/^run_[a-f0-9]{24}$/);
        });
    });

    describe('parseIdPrefix', () => {
        it('should extract prefix from valid ID', () => {
            expect(parseIdPrefix('usr_abc123')).toBe('usr');
            expect(parseIdPrefix('org_xyz')).toBe('org');
            expect(parseIdPrefix('wf_123')).toBe('wf');
        });

        it('should return null for invalid ID', () => {
            expect(parseIdPrefix('nounderscore')).toBe(null);
        });
    });

    describe('validateIdPrefix', () => {
        it('should return true for matching prefix', () => {
            expect(validateIdPrefix('usr_abc123', 'usr')).toBe(true);
        });

        it('should return false for non-matching prefix', () => {
            expect(validateIdPrefix('usr_abc123', 'org')).toBe(false);
        });
    });
});
