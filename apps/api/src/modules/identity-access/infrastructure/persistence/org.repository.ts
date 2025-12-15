import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { OrgEntity } from '../../domain/entities/org.entity';
import { OrgMemberEntity } from '../../domain/entities/org-member.entity';
import { Role } from '../../domain/value-objects/role.value-object';

@Injectable()
export class OrgRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<OrgEntity | null> {
        const org = await this.prisma.org.findUnique({
            where: { id },
        });

        if (!org) return null;

        return new OrgEntity(org.id, org.name, org.createdAt);
    }

    async findByUserId(userId: string): Promise<OrgEntity[]> {
        const memberships = await this.prisma.orgMember.findMany({
            where: { userId },
            include: { org: true },
        });

        return memberships.map(
            (m) => new OrgEntity(m.org.id, m.org.name, m.org.createdAt)
        );
    }

    async save(org: OrgEntity): Promise<void> {
        await this.prisma.org.upsert({
            where: { id: org.id },
            create: {
                id: org.id,
                name: org.name,
                createdAt: org.createdAt,
            },
            update: {
                name: org.name,
            },
        });
    }

    async findMembership(orgId: string, userId: string): Promise<OrgMemberEntity | null> {
        const membership = await this.prisma.orgMember.findUnique({
            where: {
                orgId_userId: { orgId, userId },
            },
        });

        if (!membership) return null;

        return new OrgMemberEntity(
            membership.orgId,
            membership.userId,
            membership.role as Role,
            membership.createdAt
        );
    }

    async saveMembership(membership: OrgMemberEntity): Promise<void> {
        await this.prisma.orgMember.upsert({
            where: {
                orgId_userId: { orgId: membership.orgId, userId: membership.userId },
            },
            create: {
                orgId: membership.orgId,
                userId: membership.userId,
                role: membership.role,
                createdAt: membership.createdAt,
            },
            update: {
                role: membership.role,
            },
        });
    }

    async getMembers(orgId: string): Promise<OrgMemberEntity[]> {
        const members = await this.prisma.orgMember.findMany({
            where: { orgId },
        });

        return members.map(
            (m) => new OrgMemberEntity(m.orgId, m.userId, m.role as Role, m.createdAt)
        );
    }
}
