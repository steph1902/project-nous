/**
 * Domain errors for Knowledge Base context
 */

export class DocumentNotFoundError extends Error {
    constructor(documentId: string) {
        super(`Document not found: ${documentId}`);
        this.name = 'DocumentNotFoundError';
    }
}

export class DocumentAccessDeniedError extends Error {
    constructor(documentId: string, orgId: string) {
        super(`Access denied to document ${documentId} for org ${orgId}`);
        this.name = 'DocumentAccessDeniedError';
    }
}

export class DocumentIngestionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DocumentIngestionError';
    }
}

export class EmbeddingGenerationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmbeddingGenerationError';
    }
}
