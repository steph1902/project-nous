/**
 * HR Candidate Entity
 */
import * as crypto from 'crypto';

export interface HrCandidate {
    id: string;
    orgId: string;
    name: string;
    emailHash: string;
    meta: Record<string, unknown>;
    createdAt: Date;
}

export interface CreateCandidateInput {
    orgId: string;
    name: string;
    email: string;
    meta?: Record<string, unknown>;
}

export class HrCandidateEntity {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly name: string,
        public readonly emailHash: string,
        public readonly meta: Record<string, unknown>,
        public readonly createdAt: Date
    ) { }

    static create(input: CreateCandidateInput & { id: string }): HrCandidateEntity {
        if (!input.name || input.name.trim().length === 0) {
            throw new Error('Candidate name cannot be empty');
        }

        if (!input.email || !input.email.includes('@')) {
            throw new Error('Invalid email format');
        }

        // Hash email for privacy
        const emailHash = crypto
            .createHash('sha256')
            .update(input.email.toLowerCase().trim())
            .digest('hex');

        return new HrCandidateEntity(
            input.id,
            input.orgId,
            input.name.trim(),
            emailHash,
            input.meta || {},
            new Date()
        );
    }

    toObject(): HrCandidate {
        return {
            id: this.id,
            orgId: this.orgId,
            name: this.name,
            emailHash: this.emailHash,
            meta: this.meta,
            createdAt: this.createdAt,
        };
    }
}
