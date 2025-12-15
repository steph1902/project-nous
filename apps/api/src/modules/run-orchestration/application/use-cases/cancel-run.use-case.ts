import { Injectable } from '@nestjs/common';
import { RunRepository } from '../../infrastructure/persistence/run.repository';
import {
    RunNotFoundError,
    RunAccessDeniedError,
    RunAlreadyTerminalError,
} from '../../domain/errors';

export interface CancelRunCommand {
    runId: string;
    orgId: string;
}

export interface CancelRunResult {
    runId: string;
    status: string;
    canceledAt: Date;
}

@Injectable()
export class CancelRunUseCase {
    constructor(private readonly runRepository: RunRepository) { }

    async execute(command: CancelRunCommand): Promise<CancelRunResult> {
        const run = await this.runRepository.findById(command.runId);

        if (!run) {
            throw new RunNotFoundError(command.runId);
        }

        if (run.orgId !== command.orgId) {
            throw new RunAccessDeniedError(command.runId, command.orgId);
        }

        if (run.isTerminal()) {
            throw new RunAlreadyTerminalError(command.runId, run.status);
        }

        const canceledRun = run.cancel();
        await this.runRepository.save(canceledRun);

        return {
            runId: canceledRun.id,
            status: canceledRun.status,
            canceledAt: canceledRun.finishedAt!,
        };
    }
}
