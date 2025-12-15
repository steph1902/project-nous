import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Role } from '../../domain/value-objects/role.value-object';
import * as crypto from 'crypto';

export interface ApiKeyData {
    id: string;
    orgId: string;
    userId: string;
    role: Role;
    scopes: string[];
    expiresAt: Date | null;
}

@Injectable()
export class ApiKeyRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByKey(key: string): Promise<ApiKeyData | null> {
        // Hash the key to search
        const keyHash = this.hashKey(key);

        const apiKey = await this.prisma.apiKey.findUnique({
            where: { keyHash },
            include: {
                orgMember: true,
            },
        });

        if (!apiKey) return null;

        return {
            id: apiKey.id,
            orgId: apiKey.orgId,
            userId: apiKey.userId,
            role: apiKey.orgMember.role as Role,
            scopes: apiKey.scopes as string[],
            expiresAt: apiKey.expiresAt,
        };
    }

    async create(
        orgId: string,
        userId: string,
        name: string,
        scopes: string[],
        expiresAt?: Date
    ): Promise<{ id: string; key: string }> {
        const key = this.generateKey();
        const keyHash = this.hashKey(key);
        const keyPrefix = key.substring(0, 8);

        const apiKey = await this.prisma.apiKey.create({
            data: {
                orgId,
                userId,
                name,
                keyHash,
                keyPrefix,
                scopes,
                expiresAt,
            },
        });

        // Return the raw key only once - it won't be retrievable again
        return { id: apiKey.id, key };
    }

    async updateLastUsed(id: string): Promise<void> {
        await this.prisma.apiKey.update({
            where: { id },
            data: { lastUsedAt: new Date() },
        });
    }

    async revoke(id: string): Promise<void> {
        await this.prisma.apiKey.delete({
            where: { id },
        });
    }

    private generateKey(): string {
        return `ao_${crypto.randomBytes(32).toString('hex')}`;
    }

    private hashKey(key: string): string {
        return crypto.createHash('sha256').update(key).digest('hex');
    }
}
