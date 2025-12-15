/**
 * Domain errors for HR Scoring context
 */

export class CandidateNotFoundError extends Error {
    constructor(candidateId: string) {
        super(`Candidate not found: ${candidateId}`);
        this.name = 'CandidateNotFoundError';
    }
}

export class SubmissionNotFoundError extends Error {
    constructor(submissionId: string) {
        super(`Submission not found: ${submissionId}`);
        this.name = 'SubmissionNotFoundError';
    }
}

export class ScoringError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ScoringError';
    }
}

export class RubricNotFoundError extends Error {
    constructor(rubricVersion: string) {
        super(`Rubric not found: ${rubricVersion}`);
        this.name = 'RubricNotFoundError';
    }
}
