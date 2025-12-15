"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateRankingSchema = exports.HrScoreResultSchema = exports.HrScoreOutputSchema = exports.CreateSubmissionInputSchema = exports.CreateCandidateInputSchema = void 0;
const zod_1 = require("zod");
exports.CreateCandidateInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    email: zod_1.z.string().email(),
    meta: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.CreateSubmissionInputSchema = zod_1.z.object({
    candidateId: zod_1.z.string(),
    formVersion: zod_1.z.string(),
    answers: zod_1.z.record(zod_1.z.string()),
});
exports.HrScoreOutputSchema = zod_1.z.object({
    overall: zod_1.z.number().min(0).max(100),
    categories: zod_1.z.object({
        experience: zod_1.z.number().min(0).max(25),
        skills: zod_1.z.number().min(0).max(25),
        communication: zod_1.z.number().min(0).max(25),
        cultureFit: zod_1.z.number().min(0).max(25),
    }),
    summary: zod_1.z.string().min(50).max(500),
    redFlags: zod_1.z.array(zod_1.z.string()),
    evidence: zod_1.z
        .array(zod_1.z.object({
        category: zod_1.z.string(),
        quote: zod_1.z.string(),
        reasoning: zod_1.z.string(),
    }))
        .optional(),
});
exports.HrScoreResultSchema = zod_1.z.object({
    submissionId: zod_1.z.string(),
    rubricVersion: zod_1.z.string(),
    modelId: zod_1.z.string(),
    score: exports.HrScoreOutputSchema,
    createdAt: zod_1.z.string(),
});
exports.CandidateRankingSchema = zod_1.z.object({
    candidateId: zod_1.z.string(),
    name: zod_1.z.string(),
    overallScore: zod_1.z.number(),
    categories: zod_1.z.record(zod_1.z.number()),
    submittedAt: zod_1.z.string(),
    hasRedFlags: zod_1.z.boolean(),
});
//# sourceMappingURL=hr.js.map