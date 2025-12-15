import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { SecretEntity } from '../../domain/entities/secret.entity';

@Injectable()
export class SecretRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByIntegrationId(integrationId: string): Promise<SecretEntity[]> {
        const secrets = await this.prisma.secret.findMany({
            where: { integrationId },
        });

        return secrets.map(
            (s) =>
                new SecretEntity(
                    s.id,
                    s.orgId,
                    s.integrationId,
                    s.key,
                    s.encryptedValue,
                    s.createdAt,
                    s.updatedAt
                )
        );
    }

    async findByKey(integrationId: string, key: string): Promise<SecretEntity | null> {
        const secret = await this.prisma.secret.findFirst({
            where: { integrationId, key },
        });

        if (!secret) return null;

        return new SecretEntity(
            secret.id,
            secret.orgId,
            secret.integrationId,
            secret.key,
            secret.encryptedValue,
            secret.createdAt,
            secret.updatedAt
        );
    }

    async save(secret: SecretEntity): Promise<void> {
        await this.prisma.secret.upsert({
            where: { id: secret.id },
            create: {
                id: secret.id,
                orgId: secret.orgId,
                integrationId: secret.integrationId,
                key: secret.key,
                encryptedValue: secret.encryptedValue,
                createdAt: secret.createdAt,
                updatedAt: secret.updatedAt,
            },
            update: {
                encryptedValue: secret.encryptedValue,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.secret.delete({ where: { id } });
    }
}
