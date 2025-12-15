/**
 * HR Score Entity - AI-generated score with evidence
 */
import { HrScoreOutput, HrScoreOutputSchema } from '@nous/shared';

export interface HrScore {
    id: string;
    submissionId: string;
    rubricVersion: string;
    modelId: string;
    scoreJson: HrScoreOutput;
    createdAt: Date;
}

export interface CreateScoreInput {
    submissionId: string;
    rubricVersion: string;
    modelId: string;
    scoreJson: HrScoreOutput;
}

export class HrScoreEntity {
    constructor(
        public readonly id: string,
        public readonly submissionId: string,
        public readonly rubricVersion: string,
        public readonly modelId: string,
        public readonly scoreJson: HrScoreOutput,
        public readonly createdAt: Date
    ) { }

    static create(input: CreateScoreInput & { id: string }): HrScoreEntity {
        // Validate score output
        const result = HrScoreOutputSchema.safeParse(input.scoreJson);
        if (!result.success) {
            throw new Error(`Invalid score output: ${result.error.message}`);
        }

        return new HrScoreEntity(
            input.id,
            input.submissionId,
            input.rubricVersion,
            input.modelId,
            result.data,
            new Date()
        );
    }

    getOverallScore(): number {
        return this.scoreJson.overall;
    }

    hasRedFlags(): boolean {
        return this.scoreJson.redFlags.length > 0;
    }

    getCategoryScore(category: keyof HrScoreOutput['categories']): number {
        return this.scoreJson.categories[category];
    }

    toObject(): HrScore {
        return {
            id: this.id,
            submissionId: this.submissionId,
            rubricVersion: this.rubricVersion,
            modelId: this.modelId,
            scoreJson: this.scoreJson,
            createdAt: this.createdAt,
        };
    }
}
