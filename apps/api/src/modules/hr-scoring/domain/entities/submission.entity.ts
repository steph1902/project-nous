/**
 * HR Submission Entity - Candidate's form answers
 */

export interface HrSubmission {
    id: string;
    candidateId: string;
    formVersion: string;
    answersJson: Record<string, string>;
    createdAt: Date;
}

export interface CreateSubmissionInput {
    candidateId: string;
    formVersion: string;
    answersJson: Record<string, string>;
}

export class HrSubmissionEntity {
    constructor(
        public readonly id: string,
        public readonly candidateId: string,
        public readonly formVersion: string,
        public readonly answersJson: Record<string, string>,
        public readonly createdAt: Date
    ) { }

    static create(input: CreateSubmissionInput & { id: string }): HrSubmissionEntity {
        if (Object.keys(input.answersJson).length === 0) {
            throw new Error('Answers cannot be empty');
        }

        return new HrSubmissionEntity(
            input.id,
            input.candidateId,
            input.formVersion,
            input.answersJson,
            new Date()
        );
    }

    toObject(): HrSubmission {
        return {
            id: this.id,
            candidateId: this.candidateId,
            formVersion: this.formVersion,
            answersJson: this.answersJson,
            createdAt: this.createdAt,
        };
    }
}
