import { UserEntity } from './user.entity';

describe('UserEntity', () => {
    describe('create', () => {
        it('should create a valid user entity', () => {
            const user = UserEntity.create({
                id: 'usr_123',
                email: 'test@example.com',
                name: 'Test User',
                passwordHash: 'hashed_password',
            });

            expect(user.id).toBe('usr_123');
            expect(user.email).toBe('test@example.com');
            expect(user.name).toBe('Test User');
            expect(user.passwordHash).toBe('hashed_password');
            expect(user.createdAt).toBeInstanceOf(Date);
        });

        it('should throw error for empty email', () => {
            expect(() =>
                UserEntity.create({
                    id: 'usr_123',
                    email: '',
                    name: 'Test User',
                    passwordHash: 'hashed_password',
                })
            ).toThrow('Invalid email format');
        });

        it('should throw error for invalid email format', () => {
            expect(() =>
                UserEntity.create({
                    id: 'usr_123',
                    email: 'invalid-email',
                    name: 'Test User',
                    passwordHash: 'hashed_password',
                })
            ).toThrow('Invalid email format');
        });

        it('should throw error for empty name', () => {
            expect(() =>
                UserEntity.create({
                    id: 'usr_123',
                    email: 'test@example.com',
                    name: '',
                    passwordHash: 'hashed_password',
                })
            ).toThrow('User name cannot be empty');
        });

        it('should trim whitespace from name', () => {
            const user = UserEntity.create({
                id: 'usr_123',
                email: 'test@example.com',
                name: '  Test User  ',
                passwordHash: 'hashed_password',
            });

            expect(user.name).toBe('Test User');
        });
    });

    describe('toObject', () => {
        it('should return a plain object representation', () => {
            const user = UserEntity.create({
                id: 'usr_123',
                email: 'test@example.com',
                name: 'Test User',
                passwordHash: 'hashed_password',
            });

            const obj = user.toObject();

            expect(obj).toEqual({
                id: 'usr_123',
                email: 'test@example.com',
                name: 'Test User',
                passwordHash: 'hashed_password',
                createdAt: expect.any(Date),
            });
        });
    });
});
