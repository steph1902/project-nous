import { UserEntity } from './user.entity';

describe('UserEntity', () => {
    describe('create', () => {
        it('should create a valid user entity', () => {
            const user = UserEntity.create({
                id: 'usr_123',
                email: 'Test@Example.com',
                name: 'Test User',
            });

            expect(user.id).toBe('usr_123');
            expect(user.email).toBe('test@example.com'); // Normalized
            expect(user.name).toBe('Test User');
            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.lastLoginAt).toBeNull();
        });

        it('should normalize email to lowercase', () => {
            const user = UserEntity.create({
                id: 'usr_123',
                email: 'TEST@EXAMPLE.COM',
                name: 'Test User',
            });

            expect(user.email).toBe('test@example.com');
        });

        it('should trim whitespace from email and name', () => {
            const user = UserEntity.create({
                id: 'usr_123',
                email: '  test@example.com  ',
                name: '  Test User  ',
            });

            expect(user.email).toBe('test@example.com');
            expect(user.name).toBe('Test User');
        });
    });

    describe('updateLastLogin', () => {
        it('should update lastLoginAt', () => {
            const user = UserEntity.create({
                id: 'usr_123',
                email: 'test@example.com',
                name: 'Test User',
            });

            expect(user.lastLoginAt).toBeNull();

            const updated = user.updateLastLogin();

            expect(updated.lastLoginAt).toBeInstanceOf(Date);
            expect(updated.id).toBe(user.id);
        });
    });

    describe('toObject', () => {
        it('should return a plain object representation', () => {
            const user = UserEntity.create({
                id: 'usr_123',
                email: 'test@example.com',
                name: 'Test User',
            });

            const obj = user.toObject();

            expect(obj).toEqual({
                id: 'usr_123',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: expect.any(Date),
                lastLoginAt: null,
            });
        });
    });
});
