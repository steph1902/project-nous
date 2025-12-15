import { OrgEntity } from './org.entity';

describe('OrgEntity', () => {
    describe('create', () => {
        it('should create a valid org entity', () => {
            const org = OrgEntity.create({
                id: 'org_123',
                name: 'Acme Corp',
            });

            expect(org.id).toBe('org_123');
            expect(org.name).toBe('Acme Corp');
            expect(org.createdAt).toBeInstanceOf(Date);
        });

        it('should throw error for empty name', () => {
            expect(() =>
                OrgEntity.create({
                    id: 'org_123',
                    name: '',
                })
            ).toThrow('Organization name cannot be empty');
        });

        it('should throw error for whitespace-only name', () => {
            expect(() =>
                OrgEntity.create({
                    id: 'org_123',
                    name: '   ',
                })
            ).toThrow('Organization name cannot be empty');
        });

        it('should trim whitespace from name', () => {
            const org = OrgEntity.create({
                id: 'org_123',
                name: '  Acme Corp  ',
            });

            expect(org.name).toBe('Acme Corp');
        });
    });

    describe('rename', () => {
        it('should return a new entity with updated name', () => {
            const org = OrgEntity.create({
                id: 'org_123',
                name: 'Old Name',
            });

            const renamed = org.rename('New Name');

            expect(renamed.name).toBe('New Name');
            expect(renamed.id).toBe(org.id);
            expect(renamed.createdAt).toBe(org.createdAt);
        });

        it('should throw error for empty new name', () => {
            const org = OrgEntity.create({
                id: 'org_123',
                name: 'Old Name',
            });

            expect(() => org.rename('')).toThrow('Organization name cannot be empty');
        });

        it('should trim whitespace from new name', () => {
            const org = OrgEntity.create({
                id: 'org_123',
                name: 'Old Name',
            });

            const renamed = org.rename('  New Name  ');

            expect(renamed.name).toBe('New Name');
        });
    });

    describe('toObject', () => {
        it('should return a plain object representation', () => {
            const org = OrgEntity.create({
                id: 'org_123',
                name: 'Acme Corp',
            });

            const obj = org.toObject();

            expect(obj).toEqual({
                id: 'org_123',
                name: 'Acme Corp',
                createdAt: expect.any(Date),
            });
        });
    });
});
