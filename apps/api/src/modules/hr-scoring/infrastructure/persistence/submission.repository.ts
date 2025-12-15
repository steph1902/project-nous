import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { HrSubmissionEntity } from '../../domain/entities/submission.entity';

@Injectable()
export class SubmissionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<HrSubmissionEntity | null> {
        const submission = await this.prisma.hrSubmission.findUnique({
            where: { id },
        });

        if (!submission) return null;

        return new HrSubmissionEntity(
            submission.id,
            submission.candidateId,
            submission.formVersion,
            submission.answersJson as Record<string, string>,
            submission.createdAt
        );
    }

    async findByCandidateId(candidateId: string): Promise<HrSubmissionEntity[]> {
        const submissions = await this.prisma.hrSubmission.findMany({
            where: { candidateId },
            orderBy: { createdAt: 'desc' },
        });

        return submissions.map(
            (s) =>
                new HrSubmissionEntity(
                    s.id,
                    s.candidateId,
                    s.formVersion,
                    s.answersJson as Record<string, string>,
                    s.createdAt
                )
        );
    }

    async save(submission: HrSubmissionEntity): Promise<void> {
        await this.prisma.hrSubmission.upsert({
            where: { id: submission.id },
            create: {
                id: submission.id,
                candidateId: submission.candidateId,
                formVersion: submission.formVersion,
                answersJson: submission.answersJson,
                createdAt: submission.createdAt,
            },
            update: {
                answersJson: submission.answersJson,
            },
        });
    }
}
