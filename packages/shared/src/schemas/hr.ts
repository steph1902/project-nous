import { z } from 'zod';

/**
 * HR Scoring schemas
 */

// Candidate input
export const CreateCandidateInputSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email(),
    meta: z.record(z.unknown()).optional(),
});

export type CreateCandidateInput = z.infer<typeof CreateCandidateInputSchema>;

// Submission input
export const CreateSubmissionInputSchema = z.object({
    candidateId: z.string(),
    formVersion: z.string(),
    answers: z.record(z.string()),
});

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionInputSchema>;

// Score output schema (what the LLM should return)
export const HrScoreOutputSchema = z.object({
    overall: z.number().min(0).max(100),
    categories: z.object({
        experience: z.number().min(0).max(25),
        skills: z.number().min(0).max(25),
        communication: z.number().min(0).max(25),
        cultureFit: z.number().min(0).max(25),
    }),
    summary: z.string().min(50).max(500),
    redFlags: z.array(z.string()),
    evidence: z
        .array(
            z.object({
                category: z.string(),
                quote: z.string(),
                reasoning: z.string(),
            })
        )
        .optional(),
});

export type HrScoreOutput = z.infer<typeof HrScoreOutputSchema>;

// Score result (stored in DB)
export const HrScoreResultSchema = z.object({
    submissionId: z.string(),
    rubricVersion: z.string(),
    modelId: z.string(),
    score: HrScoreOutputSchema,
    createdAt: z.string(),
});

export type HrScoreResult = z.infer<typeof HrScoreResultSchema>;

// Candidate ranking
export const CandidateRankingSchema = z.object({
    candidateId: z.string(),
    name: z.string(),
    overallScore: z.number(),
    categories: z.record(z.number()),
    submittedAt: z.string(),
    hasRedFlags: z.boolean(),
});

export type CandidateRanking = z.infer<typeof CandidateRankingSchema>;
