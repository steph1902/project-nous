import {
    Controller,
    Get,
    Param,
    Sse,
    UseGuards,
    HttpException,
    HttpStatus,
    MessageEvent,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Observable, interval, map, takeWhile } from 'rxjs';
import { JwtAuthGuard } from '@/modules/identity-access/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '@/modules/identity-access/infrastructure/auth/current-user.decorator';
import { AuthUser } from '@/modules/identity-access/infrastructure/auth/jwt.strategy';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@ApiTags('Run Monitor')
@Controller('runs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RunMonitorController {
    constructor(private readonly prisma: PrismaService) { }

    @Sse(':runId/stream')
    @ApiOperation({ summary: 'Stream run status updates via SSE' })
    streamRun(
        @Param('runId') runId: string,
        @CurrentUser() user: AuthUser
    ): Observable<MessageEvent> {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        let isTerminal = false;

        return interval(1000).pipe(
            takeWhile(() => !isTerminal),
            map(async () => {
                const run = await this.prisma.run.findFirst({
                    where: { id: runId, orgId: user.orgId },
                    include: {
                        nodes: {
                            orderBy: { startedAt: 'asc' },
                        },
                    },
                });

                if (!run) {
                    isTerminal = true;
                    return { data: { error: 'Run not found' } };
                }

                isTerminal = ['SUCCEEDED', 'FAILED', 'CANCELED'].includes(run.status);

                return {
                    data: {
                        runId: run.id,
                        status: run.status,
                        startedAt: run.startedAt,
                        finishedAt: run.finishedAt,
                        nodes: run.nodes.map((n) => ({
                            nodeKey: n.nodeKey,
                            type: n.type,
                            status: n.status,
                            attempts: n.attempts,
                            startedAt: n.startedAt,
                            finishedAt: n.finishedAt,
                        })),
                    },
                };
            })
        ) as Observable<MessageEvent>;
    }

    @Get(':runId/logs')
    @ApiOperation({ summary: 'Get run execution logs' })
    async getRunLogs(
        @Param('runId') runId: string,
        @CurrentUser() user: AuthUser
    ) {
        if (!user.orgId) {
            throw new HttpException('Org context required', HttpStatus.BAD_REQUEST);
        }

        const run = await this.prisma.run.findFirst({
            where: { id: runId, orgId: user.orgId },
            include: {
                nodes: {
                    orderBy: { startedAt: 'asc' },
                },
            },
        });

        if (!run) {
            throw new HttpException('Run not found', HttpStatus.NOT_FOUND);
        }

        // Build execution timeline
        const timeline = run.nodes.map((node) => ({
            timestamp: node.startedAt || new Date(),
            nodeKey: node.nodeKey,
            type: node.type,
            status: node.status,
            attempts: node.attempts,
            durationMs: node.finishedAt && node.startedAt
                ? node.finishedAt.getTime() - node.startedAt.getTime()
                : null,
            error: node.errorJson,
        }));

        return {
            runId: run.id,
            status: run.status,
            startedAt: run.startedAt,
            finishedAt: run.finishedAt,
            durationMs: run.finishedAt
                ? run.finishedAt.getTime() - run.startedAt.getTime()
                : null,
            timeline,
        };
    }
}
