import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateCandidateUseCase } from '../../application/use-cases/create-candidate.use-case';
import { SubmitAnswersUseCase } from '../../application/use-cases/submit-answers.use-case';
import { ScoreCandidateUseCase } from '../../application/use-cases/score-candidate.use-case';
import { GetCandidateRankingsUseCase } from '../../application/use-cases/get-rankings.use-case';
import { CandidateRepository } from '../persistence/candidate.repository';
import { JwtAuthGuard } from '@/modules/identity-access/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '@/modules/identity-access/infrastructure/auth/roles.guard';
import { CurrentUser } from '@/modules/identity-access/infrastructure/auth/current-user.decorator';
import { Roles } from '@/modules/identity-access/infrastructure/auth/roles.decorator';
import { Role } from '@/modules/identity-access/domain/value-objects/role.value-object';
import { AuthUser } from '@/modules/identity-access/infrastructure/auth/jwt.strategy';
import { CandidateNotFoundError, SubmissionNotFoundError } from '../../domain/errors';

// DTOs
class CreateCandidateDto {
    name!: string;
    email!: string;
    meta?: Record<string, unknown>;
}

class SubmitAnswersDto {
    formVersion!: string;
    answers!: Record<string, string>;
}

class ScoreSubmissionDto {
    rubricVersion!: string;
}

@ApiTags('HR Scoring')
@Controller('hr')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HrScoringController {
    constructor(
        private readonly createCandidate: CreateCandidateUseCase,
        private readonly submitAnswers: SubmitAnswersUseCase,
        private readonly scoreCandidate: ScoreCandidateUseCase,
        private readonly getRankings: GetCandidateRankingsUseCase,
        private readonly candidateRepository: CandidateRepository
    ) { }

    @Post('candidates')
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Create a new candidate' })
    async create(@Body() dto: CreateCandidateDto, @CurrentUser() user: AuthUser) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.createCandidate.execute({
            orgId: user.orgId,
            name: dto.name,
            email: dto.email,
            meta: dto.meta,
        });

        return result;
    }

    @Get('candidates')
    @ApiOperation({ summary: 'List candidates' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async listCandidates(
        @CurrentUser() user: AuthUser,
        @Query('limit') limit?: string
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const candidates = await this.candidateRepository.findByOrgId(
            user.orgId,
            limit ? parseInt(limit, 10) : 50
        );

        return { candidates: candidates.map((c) => c.toObject()) };
    }

    @Post('candidates/:candidateId/submissions')
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Submit candidate answers' })
    async submit(
        @Param('candidateId') candidateId: string,
        @Body() dto: SubmitAnswersDto
    ) {
        try {
            const result = await this.submitAnswers.execute({
                candidateId,
                formVersion: dto.formVersion,
                answers: dto.answers,
            });

            return result;
        } catch (error) {
            if (error instanceof CandidateNotFoundError) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }

    @Post('submissions/:submissionId/score')
    @Roles(Role.OPERATOR)
    @ApiOperation({ summary: 'Score a submission' })
    async score(
        @Param('submissionId') submissionId: string,
        @Body() dto: ScoreSubmissionDto
    ) {
        try {
            const result = await this.scoreCandidate.execute({
                submissionId,
                rubricVersion: dto.rubricVersion,
            });

            return result;
        } catch (error) {
            if (error instanceof SubmissionNotFoundError) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }

    @Get('rankings')
    @ApiOperation({ summary: 'Get candidate rankings' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async rankings(
        @CurrentUser() user: AuthUser,
        @Query('limit') limit?: string
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const result = await this.getRankings.execute({
            orgId: user.orgId,
            limit: limit ? parseInt(limit, 10) : undefined,
        });

        return result;
    }
}
