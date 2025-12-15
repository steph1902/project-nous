import { HrScoreOutputSchema } from './hr';

describe('HrScoreOutputSchema', () => {
    it('should validate correct score output', () => {
        const score = {
            overall: 85,
            categories: {
                experience: 22,
                skills: 21,
                communication: 20,
                cultureFit: 22,
            },
            summary: 'Strong candidate with relevant experience.',
            redFlags: [],
        };

        const result = HrScoreOutputSchema.safeParse(score);

        expect(result.success).toBe(true);
    });

    it('should reject overall score above 100', () => {
        const score = {
            overall: 150,
            categories: {
                experience: 25,
                skills: 25,
                communication: 25,
                cultureFit: 25,
            },
            summary: 'Test',
            redFlags: [],
        };

        const result = HrScoreOutputSchema.safeParse(score);

        expect(result.success).toBe(false);
    });

    it('should reject category score above 25', () => {
        const score = {
            overall: 85,
            categories: {
                experience: 30, // Invalid
                skills: 21,
                communication: 20,
                cultureFit: 22,
            },
            summary: 'Test',
            redFlags: [],
        };

        const result = HrScoreOutputSchema.safeParse(score);

        expect(result.success).toBe(false);
    });

    it('should accept scores with red flags', () => {
        const score = {
            overall: 60,
            categories: {
                experience: 15,
                skills: 15,
                communication: 15,
                cultureFit: 15,
            },
            summary: 'Candidate has some concerns.',
            redFlags: ['Gaps in employment', 'Inconsistent responses'],
        };

        const result = HrScoreOutputSchema.safeParse(score);

        expect(result.success).toBe(true);
    });
});
