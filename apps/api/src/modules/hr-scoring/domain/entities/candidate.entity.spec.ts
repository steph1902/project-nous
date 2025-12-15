import { HrCandidateEntity } from './candidate.entity';

describe('HrCandidateEntity', () => {
    describe('create', () => {
        it('should create a valid candidate entity', () => {
            const candidate = HrCandidateEntity.create({
                id: 'cand_123',
                orgId: 'org_456',
                name: 'Alice Johnson',
                email: 'alice@example.com',
            });

            expect(candidate.id).toBe('cand_123');
            expect(candidate.orgId).toBe('org_456');
            expect(candidate.name).toBe('Alice Johnson');
            expect(candidate.emailHash).toBeDefined();
            expect(candidate.emailHash).not.toBe('alice@example.com');
            expect(candidate.meta).toEqual({});
        });

        it('should hash email consistently', () => {
            const candidate1 = HrCandidateEntity.create({
                id: 'cand_1',
                orgId: 'org_456',
                name: 'Alice',
                email: 'alice@example.com',
            });

            const candidate2 = HrCandidateEntity.create({
                id: 'cand_2',
                orgId: 'org_456',
                name: 'Alice',
                email: 'alice@example.com',
            });

            expect(candidate1.emailHash).toBe(candidate2.emailHash);
        });

        it('should normalize email case for hashing', () => {
            const candidate1 = HrCandidateEntity.create({
                id: 'cand_1',
                orgId: 'org_456',
                name: 'Alice',
                email: 'Alice@Example.COM',
            });

            const candidate2 = HrCandidateEntity.create({
                id: 'cand_2',
                orgId: 'org_456',
                name: 'Alice',
                email: 'alice@example.com',
            });

            expect(candidate1.emailHash).toBe(candidate2.emailHash);
        });

        it('should throw error for empty name', () => {
            expect(() =>
                HrCandidateEntity.create({
                    id: 'cand_123',
                    orgId: 'org_456',
                    name: '',
                    email: 'alice@example.com',
                })
            ).toThrow('Candidate name cannot be empty');
        });

        it('should throw error for invalid email', () => {
            expect(() =>
                HrCandidateEntity.create({
                    id: 'cand_123',
                    orgId: 'org_456',
                    name: 'Alice',
                    email: 'invalid-email',
                })
            ).toThrow('Invalid email format');
        });

        it('should accept optional meta', () => {
            const candidate = HrCandidateEntity.create({
                id: 'cand_123',
                orgId: 'org_456',
                name: 'Alice',
                email: 'alice@example.com',
                meta: { source: 'linkedin' },
            });

            expect(candidate.meta).toEqual({ source: 'linkedin' });
        });
    });

    describe('toObject', () => {
        it('should return plain object', () => {
            const candidate = HrCandidateEntity.create({
                id: 'cand_123',
                orgId: 'org_456',
                name: 'Alice',
                email: 'alice@example.com',
            });

            const obj = candidate.toObject();

            expect(obj.id).toBe('cand_123');
            expect(obj.name).toBe('Alice');
            expect(obj.emailHash).toBeDefined();
            expect(obj).not.toHaveProperty('email'); // Email should not be exposed
        });
    });
});
