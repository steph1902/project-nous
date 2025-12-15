import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { IntegrationEntity, IntegrationType } from '../../domain/entities/integration.entity';

@Injectable()
export class IntegrationRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<IntegrationEntity | null> {
        const integration = await this.prisma.integration.findUnique({
            where: { id },
        });

        if (!integration) return null;

        return new IntegrationEntity(
            integration.id,
            integration.orgId,
            integration.name,
            integration.type as IntegrationType,
            integration.configJson as Record<string, unknown>,
            integration.permissionsJson as string[],
            integration.enabled,
            integration.createdAt
        );
    }

    async findByOrgId(orgId: string): Promise<IntegrationEntity[]> {
        const integrations = await this.prisma.integration.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
        });

        return integrations.map(
            (i) =>
                new IntegrationEntity(
                    i.id,
                    i.orgId,
                    i.name,
                    i.type as IntegrationType,
                    i.configJson as Record<string, unknown>,
                    i.permissionsJson as string[],
                    i.enabled,
                    i.createdAt
                )
        );
    }

    async save(integration: IntegrationEntity): Promise<void> {
        await this.prisma.integration.upsert({
            where: { id: integration.id },
            create: {
                id: integration.id,
                orgId: integration.orgId,
                name: integration.name,
                type: integration.type,
                configJson: integration.configJson,
                permissionsJson: integration.permissions,
                enabled: integration.enabled,
                createdAt: integration.createdAt,
            },
            update: {
                name: integration.name,
                configJson: integration.configJson,
                permissionsJson: integration.permissions,
                enabled: integration.enabled,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.integration.delete({ where: { id } });
    }
}
