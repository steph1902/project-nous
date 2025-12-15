import { SecretEntity } from './secret.entity';

describe('SecretEntity', () => {
    const encryptionKey = 'test-encryption-key-32-chars!!!';

    describe('create', () => {
        it('should create a secret with encrypted value', () => {
            const secret = SecretEntity.create({
                id: 'sec_123',
                orgId: 'org_456',
                integrationId: 'int_789',
                key: 'API_KEY',
                value: 'super-secret-value',
                encryptionKey,
            });

            expect(secret.id).toBe('sec_123');
            expect(secret.key).toBe('API_KEY');
            expect(secret.encryptedValue).not.toBe('super-secret-value');
            expect(secret.encryptedValue).toContain(':'); // IV:authTag:encrypted format
        });

        it('should throw error for empty key', () => {
            expect(() =>
                SecretEntity.create({
                    id: 'sec_123',
                    orgId: 'org_456',
                    integrationId: 'int_789',
                    key: '',
                    value: 'super-secret-value',
                    encryptionKey,
                })
            ).toThrow('Secret key cannot be empty');
        });
    });

    describe('encrypt/decrypt', () => {
        it('should round-trip encrypt and decrypt a value', () => {
            const originalValue = 'my-secret-api-key-12345';

            const encrypted = SecretEntity.encrypt(originalValue, encryptionKey);
            const decrypted = SecretEntity.decrypt(encrypted, encryptionKey);

            expect(decrypted).toBe(originalValue);
        });

        it('should produce different ciphertext for same plaintext (due to random IV)', () => {
            const value = 'same-value';

            const encrypted1 = SecretEntity.encrypt(value, encryptionKey);
            const encrypted2 = SecretEntity.encrypt(value, encryptionKey);

            expect(encrypted1).not.toBe(encrypted2);
        });

        it('should be able to decrypt entity value', () => {
            const secret = SecretEntity.create({
                id: 'sec_123',
                orgId: 'org_456',
                integrationId: 'int_789',
                key: 'API_KEY',
                value: 'super-secret-value',
                encryptionKey,
            });

            const decrypted = secret.decrypt(encryptionKey);

            expect(decrypted).toBe('super-secret-value');
        });
    });
});
