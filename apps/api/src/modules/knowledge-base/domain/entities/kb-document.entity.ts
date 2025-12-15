/**
 * KB Document Entity - Knowledge base document for RAG
 */

export type SourceType = 'PDF' | 'MARKDOWN' | 'HTML' | 'TEXT';
export type AccessLevel = 'ORG' | 'WORKFLOW' | 'PUBLIC';

export interface KbDocument {
    id: string;
    orgId: string;
    title: string;
    sourceType: SourceType;
    s3Key: string;
    tags: string[];
    accessLevel: AccessLevel;
    createdAt: Date;
}

export interface CreateKbDocumentInput {
    orgId: string;
    title: string;
    sourceType: SourceType;
    s3Key: string;
    tags?: string[];
    accessLevel?: AccessLevel;
}

export class KbDocumentEntity {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly title: string,
        public readonly sourceType: SourceType,
        public readonly s3Key: string,
        public readonly tags: string[],
        public readonly accessLevel: AccessLevel,
        public readonly createdAt: Date
    ) { }

    static create(input: CreateKbDocumentInput & { id: string }): KbDocumentEntity {
        if (!input.title || input.title.trim().length === 0) {
            throw new Error('Document title cannot be empty');
        }

        return new KbDocumentEntity(
            input.id,
            input.orgId,
            input.title.trim(),
            input.sourceType,
            input.s3Key,
            input.tags || [],
            input.accessLevel || 'ORG',
            new Date()
        );
    }

    addTag(tag: string): KbDocumentEntity {
        if (this.tags.includes(tag)) return this;

        return new KbDocumentEntity(
            this.id,
            this.orgId,
            this.title,
            this.sourceType,
            this.s3Key,
            [...this.tags, tag],
            this.accessLevel,
            this.createdAt
        );
    }

    removeTag(tag: string): KbDocumentEntity {
        return new KbDocumentEntity(
            this.id,
            this.orgId,
            this.title,
            this.sourceType,
            this.s3Key,
            this.tags.filter((t) => t !== tag),
            this.accessLevel,
            this.createdAt
        );
    }

    toObject(): KbDocument {
        return {
            id: this.id,
            orgId: this.orgId,
            title: this.title,
            sourceType: this.sourceType,
            s3Key: this.s3Key,
            tags: this.tags,
            accessLevel: this.accessLevel,
            createdAt: this.createdAt,
        };
    }
}
