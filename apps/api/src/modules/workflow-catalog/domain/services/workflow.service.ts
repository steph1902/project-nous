import { Injectable } from '@nestjs/common';
import { WorkflowEntity, CreateWorkflowInput } from '../entities/workflow.entity';
import {
    WorkflowVersionEntity,
    CreateWorkflowVersionInput,
} from '../entities/workflow-version.entity';
import { generateWorkflowId, generateWorkflowVersionId } from '@nous/shared';

@Injectable()
export class WorkflowService {
    createWorkflow(input: CreateWorkflowInput): WorkflowEntity {
        const id = generateWorkflowId();
        return WorkflowEntity.create({ ...input, id });
    }

    createVersion(input: CreateWorkflowVersionInput): WorkflowVersionEntity {
        const id = generateWorkflowVersionId();
        return WorkflowVersionEntity.create({ ...input, id });
    }

    publishVersion(version: WorkflowVersionEntity): WorkflowVersionEntity {
        return version.publish();
    }

    archiveVersion(version: WorkflowVersionEntity): WorkflowVersionEntity {
        return version.archive();
    }
}
