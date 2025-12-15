import { z } from 'zod';
export declare const CreateCandidateInputSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    meta?: Record<string, unknown> | undefined;
}, {
    name: string;
    email: string;
    meta?: Record<string, unknown> | undefined;
}>;
export type CreateCandidateInput = z.infer<typeof CreateCandidateInputSchema>;
export declare const CreateSubmissionInputSchema: z.ZodObject<{
    candidateId: z.ZodString;
    formVersion: z.ZodString;
    answers: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    candidateId: string;
    formVersion: string;
    answers: Record<string, string>;
}, {
    candidateId: string;
    formVersion: string;
    answers: Record<string, string>;
}>;
export type CreateSubmissionInput = z.infer<typeof CreateSubmissionInputSchema>;
export declare const HrScoreOutputSchema: z.ZodObject<{
    overall: z.ZodNumber;
    categories: z.ZodObject<{
        experience: z.ZodNumber;
        skills: z.ZodNumber;
        communication: z.ZodNumber;
        cultureFit: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        experience: number;
        skills: number;
        communication: number;
        cultureFit: number;
    }, {
        experience: number;
        skills: number;
        communication: number;
        cultureFit: number;
    }>;
    summary: z.ZodString;
    redFlags: z.ZodArray<z.ZodString, "many">;
    evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodString;
        quote: z.ZodString;
        reasoning: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        category: string;
        quote: string;
        reasoning: string;
    }, {
        category: string;
        quote: string;
        reasoning: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    overall: number;
    categories: {
        experience: number;
        skills: number;
        communication: number;
        cultureFit: number;
    };
    redFlags: string[];
    evidence?: {
        category: string;
        quote: string;
        reasoning: string;
    }[] | undefined;
}, {
    summary: string;
    overall: number;
    categories: {
        experience: number;
        skills: number;
        communication: number;
        cultureFit: number;
    };
    redFlags: string[];
    evidence?: {
        category: string;
        quote: string;
        reasoning: string;
    }[] | undefined;
}>;
export type HrScoreOutput = z.infer<typeof HrScoreOutputSchema>;
export declare const HrScoreResultSchema: z.ZodObject<{
    submissionId: z.ZodString;
    rubricVersion: z.ZodString;
    modelId: z.ZodString;
    score: z.ZodObject<{
        overall: z.ZodNumber;
        categories: z.ZodObject<{
            experience: z.ZodNumber;
            skills: z.ZodNumber;
            communication: z.ZodNumber;
            cultureFit: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            experience: number;
            skills: number;
            communication: number;
            cultureFit: number;
        }, {
            experience: number;
            skills: number;
            communication: number;
            cultureFit: number;
        }>;
        summary: z.ZodString;
        redFlags: z.ZodArray<z.ZodString, "many">;
        evidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            category: z.ZodString;
            quote: z.ZodString;
            reasoning: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            category: string;
            quote: string;
            reasoning: string;
        }, {
            category: string;
            quote: string;
            reasoning: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        summary: string;
        overall: number;
        categories: {
            experience: number;
            skills: number;
            communication: number;
            cultureFit: number;
        };
        redFlags: string[];
        evidence?: {
            category: string;
            quote: string;
            reasoning: string;
        }[] | undefined;
    }, {
        summary: string;
        overall: number;
        categories: {
            experience: number;
            skills: number;
            communication: number;
            cultureFit: number;
        };
        redFlags: string[];
        evidence?: {
            category: string;
            quote: string;
            reasoning: string;
        }[] | undefined;
    }>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    submissionId: string;
    rubricVersion: string;
    modelId: string;
    score: {
        summary: string;
        overall: number;
        categories: {
            experience: number;
            skills: number;
            communication: number;
            cultureFit: number;
        };
        redFlags: string[];
        evidence?: {
            category: string;
            quote: string;
            reasoning: string;
        }[] | undefined;
    };
    createdAt: string;
}, {
    submissionId: string;
    rubricVersion: string;
    modelId: string;
    score: {
        summary: string;
        overall: number;
        categories: {
            experience: number;
            skills: number;
            communication: number;
            cultureFit: number;
        };
        redFlags: string[];
        evidence?: {
            category: string;
            quote: string;
            reasoning: string;
        }[] | undefined;
    };
    createdAt: string;
}>;
export type HrScoreResult = z.infer<typeof HrScoreResultSchema>;
export declare const CandidateRankingSchema: z.ZodObject<{
    candidateId: z.ZodString;
    name: z.ZodString;
    overallScore: z.ZodNumber;
    categories: z.ZodRecord<z.ZodString, z.ZodNumber>;
    submittedAt: z.ZodString;
    hasRedFlags: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    candidateId: string;
    categories: Record<string, number>;
    overallScore: number;
    submittedAt: string;
    hasRedFlags: boolean;
}, {
    name: string;
    candidateId: string;
    categories: Record<string, number>;
    overallScore: number;
    submittedAt: string;
    hasRedFlags: boolean;
}>;
export type CandidateRanking = z.infer<typeof CandidateRankingSchema>;
//# sourceMappingURL=hr.d.ts.map