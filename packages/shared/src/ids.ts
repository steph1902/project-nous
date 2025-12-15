import * as crypto from 'crypto';

/**
 * ID generation utilities with typed prefixes
 * Following the pattern: prefix_randomhex
 */

function generateId(prefix: string, bytes: number = 12): string {
    return `${prefix}_${crypto.randomBytes(bytes).toString('hex')}`;
}

// User IDs
export function generateUserId(): string {
    return generateId('usr');
}

// Organization IDs
export function generateOrgId(): string {
    return generateId('org');
}

// Workflow IDs
export function generateWorkflowId(): string {
    return generateId('wf');
}

// Workflow Version IDs
export function generateWorkflowVersionId(): string {
    return generateId('wfv');
}

// Run IDs
export function generateRunId(): string {
    return generateId('run');
}

// Run Node IDs
export function generateRunNodeId(): string {
    return generateId('rn');
}

// Artifact IDs
export function generateArtifactId(): string {
    return generateId('art');
}

// Integration IDs
export function generateIntegrationId(): string {
    return generateId('int');
}

// API Key IDs
export function generateApiKeyId(): string {
    return generateId('ak');
}

// KB Document IDs
export function generateKbDocumentId(): string {
    return generateId('doc');
}

// KB Chunk IDs
export function generateKbChunkId(): string {
    return generateId('chk');
}

// HR Candidate IDs
export function generateCandidateId(): string {
    return generateId('cand');
}

// HR Submission IDs
export function generateSubmissionId(): string {
    return generateId('sub');
}

// Audit Event IDs
export function generateAuditEventId(): string {
    return generateId('evt');
}

// Prompt Template IDs
export function generatePromptTemplateId(): string {
    return generateId('pt');
}

// Idempotency Key IDs
export function generateIdempotencyId(): string {
    return generateId('idem');
}

// Request IDs (for tracing)
export function generateRequestId(): string {
    return generateId('req', 8);
}

/**
 * Parse an ID to extract the prefix type
 */
export function parseIdPrefix(id: string): string | null {
    const parts = id.split('_');
    return parts.length >= 2 ? parts[0] : null;
}

/**
 * Validate that an ID has the expected prefix
 */
export function validateIdPrefix(id: string, expectedPrefix: string): boolean {
    return parseIdPrefix(id) === expectedPrefix;
}
