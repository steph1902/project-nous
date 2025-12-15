import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import {
    KbDocumentEntity,
    SourceType,
    AccessLevel,
} from '../../domain/entities/kb-document.entity';

@Injectable()
export class KbDocumentRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<KbDocumentEntity | null> {
        const doc = await this.prisma.kbDocument.findUnique({
            where: { id },
        });

        if (!doc) return null;

        return new KbDocumentEntity(
            doc.id,
            doc.orgId,
            doc.title,
            doc.sourceType as SourceType,
            doc.s3Key,
            doc.tagsJson as string[],
            doc.accessLevel as AccessLevel,
            doc.createdAt
        );
    }

    async findByOrgId(
        orgId: string,
        limit: number = 20,
        cursor?: string,
        tags?: string[]
    ): Promise<KbDocumentEntity[]> {
        const docs = await this.prisma.kbDocument.findMany({
            where: {
                orgId,
                ...(tags && tags.length > 0 && {
                    tagsJson: { array_contains: tags },
                }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1,
            }),
        });

        return docs.map(
            (d) =>
                new KbDocumentEntity(
                    d.id,
                    d.orgId,
                    d.title,
                    d.sourceType as SourceType,
                    d.s3Key,
                    d.tagsJson as string[],
                    d.accessLevel as AccessLevel,
                    d.createdAt
                )
        );
    }

    async countByOrgId(orgId: string): Promise<number> {
        return this.prisma.kbDocument.count({ where: { orgId } });
    }

    async save(document: KbDocumentEntity): Promise<void> {
        await this.prisma.kbDocument.upsert({
            where: { id: document.id },
            create: {
                id: document.id,
                orgId: document.orgId,
                title: document.title,
                sourceType: document.sourceType,
                s3Key: document.s3Key,
                tagsJson: document.tags,
                accessLevel: document.accessLevel,
                createdAt: document.createdAt,
            },
            update: {
                title: document.title,
                tagsJson: document.tags,
                accessLevel: document.accessLevel,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.kbDocument.delete({ where: { id } });
    }
}
