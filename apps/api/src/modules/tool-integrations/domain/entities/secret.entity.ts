/**
 * Secret Entity - Encrypted credentials for integrations
 */
import * as crypto from 'crypto';

export interface Secret {
    id: string;
    orgId: string;
    integrationId: string;
    key: string;
    encryptedValue: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSecretInput {
    orgId: string;
    integrationId: string;
    key: string;
    value: string;
    encryptionKey: string;
}

export class SecretEntity {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly integrationId: string,
        public readonly key: string,
        public readonly encryptedValue: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    static create(input: CreateSecretInput & { id: string }): SecretEntity {
        if (!input.key || input.key.trim().length === 0) {
            throw new Error('Secret key cannot be empty');
        }

        const encryptedValue = SecretEntity.encrypt(input.value, input.encryptionKey);

        return new SecretEntity(
            input.id,
            input.orgId,
            input.integrationId,
            input.key.trim(),
            encryptedValue,
            new Date(),
            new Date()
        );
    }

    static encrypt(value: string, key: string): string {
        const iv = crypto.randomBytes(16);
        const keyBuffer = crypto.scryptSync(key, 'salt', 32);
        const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);

        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }

    static decrypt(encryptedValue: string, key: string): string {
        const [ivHex, authTagHex, encrypted] = encryptedValue.split(':');

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const keyBuffer = crypto.scryptSync(key, 'salt', 32);

        const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    decrypt(encryptionKey: string): string {
        return SecretEntity.decrypt(this.encryptedValue, encryptionKey);
    }

    toObject(): Secret {
        return {
            id: this.id,
            orgId: this.orgId,
            integrationId: this.integrationId,
            key: this.key,
            encryptedValue: this.encryptedValue,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
