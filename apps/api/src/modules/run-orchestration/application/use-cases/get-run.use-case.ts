import { Injectable } from '@nestjs/common';
import { RunRepository } from '../../infrastructure/persistence/run.repository';
import { RunNodeRepository } from '../../infrastructure/persistence/run-node.repository';
import { Run } from '../../domain/entities/run.entity';
import { RunNode } from '../../domain/entities/run-node.entity';
import { RunNotFoundError, RunAccessDeniedError } from '../../domain/errors';

export interface GetRunQuery {
    runId: string;
    orgId: string;
    includeNodes?: boolean;
}

export interface GetRunResult {
    run: Run;
    nodes?: RunNode[];
}

@Injectable()
export class GetRunUseCase {
    constructor(
        private readonly runRepository: RunRepository,
        private readonly runNodeRepository: RunNodeRepository
    ) { }

    async execute(query: GetRunQuery): Promise<GetRunResult> {
        const run = await this.runRepository.findById(query.runId);

        if (!run) {
            throw new RunNotFoundError(query.runId);
        }

        if (run.orgId !== query.orgId) {
            throw new RunAccessDeniedError(query.runId, query.orgId);
        }

        const result: GetRunResult = {
            run: run.toObject(),
        };

        if (query.includeNodes) {
            const nodes = await this.runNodeRepository.findByRunId(query.runId);
            result.nodes = nodes.map((n) => n.toObject());
        }

        return result;
    }
}
