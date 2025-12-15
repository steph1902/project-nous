/**
 * Workflow Version Entity - Immutable version of a workflow DAG
 */
import { WorkflowDag, validateDag } from '@nous/shared';

export type WorkflowVersionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface WorkflowVersion {
    id: string;
    workflowId: string;
    version: number;
    status: WorkflowVersionStatus;
    dagJson: WorkflowDag;
    createdBy: string;
    createdAt: Date;
}

export interface CreateWorkflowVersionInput {
    workflowId: string;
    version: number;
    dagJson: WorkflowDag;
    createdBy: string;
}

export class WorkflowVersionEntity {
    constructor(
        public readonly id: string,
        public readonly workflowId: string,
        public readonly version: number,
        public readonly status: WorkflowVersionStatus,
        public readonly dagJson: WorkflowDag,
        public readonly createdBy: string,
        public readonly createdAt: Date
    ) { }

    static create(
        input: CreateWorkflowVersionInput & { id: string }
    ): WorkflowVersionEntity {
        // Validate DAG structure
        const validation = validateDag(input.dagJson);
        if (!validation.valid) {
            throw new DagValidationError(validation.errors);
        }

        return new WorkflowVersionEntity(
            input.id,
            input.workflowId,
            input.version,
            'DRAFT',
            input.dagJson,
            input.createdBy,
            new Date()
        );
    }

    publish(): WorkflowVersionEntity {
        if (this.status !== 'DRAFT') {
            throw new Error('Only draft versions can be published');
        }

        return new WorkflowVersionEntity(
            this.id,
            this.workflowId,
            this.version,
            'PUBLISHED',
            this.dagJson,
            this.createdBy,
            this.createdAt
        );
    }

    archive(): WorkflowVersionEntity {
        if (this.status === 'ARCHIVED') {
            throw new Error('Version is already archived');
        }

        return new WorkflowVersionEntity(
            this.id,
            this.workflowId,
            this.version,
            'ARCHIVED',
            this.dagJson,
            this.createdBy,
            this.createdAt
        );
    }

    isPublished(): boolean {
        return this.status === 'PUBLISHED';
    }

    isDraft(): boolean {
        return this.status === 'DRAFT';
    }

    getNodeCount(): number {
        return this.dagJson.nodes.length;
    }

    getNodeByKey(key: string) {
        return this.dagJson.nodes.find((n) => n.key === key);
    }

    toObject(): WorkflowVersion {
        return {
            id: this.id,
            workflowId: this.workflowId,
            version: this.version,
            status: this.status,
            dagJson: this.dagJson,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
        };
    }
}

/**
 * DAG Validation Error with detailed error messages
 */
export class DagValidationError extends Error {
    constructor(public readonly errors: string[]) {
        super(`Invalid DAG: ${errors.join('; ')}`);
        this.name = 'DagValidationError';
    }
}
