import { Injectable } from '@nestjs/common';
import { RunEntity, CreateRunInput } from '../entities/run.entity';
import { RunNodeEntity, CreateRunNodeInput } from '../entities/run-node.entity';
import { generateRunId, generateRunNodeId } from '@nous/shared';

@Injectable()
export class RunService {
    createRun(input: CreateRunInput): RunEntity {
        const id = generateRunId();
        return RunEntity.create({ ...input, id });
    }

    createRunNode(input: CreateRunNodeInput): RunNodeEntity {
        const id = generateRunNodeId();
        return RunNodeEntity.create({ ...input, id });
    }
}
