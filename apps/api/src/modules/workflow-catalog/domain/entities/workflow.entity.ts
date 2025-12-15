/**
 * Workflow Entity - Core domain entity for workflow definitions
 */

export interface Workflow {
    id: string;
    orgId: string;
    name: string;
    description: string | null;
    createdBy: string;
    createdAt: Date;
}

export interface CreateWorkflowInput {
    orgId: string;
    name: string;
    description?: string;
    createdBy: string;
}

export class WorkflowEntity {
    constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly name: string,
        public readonly description: string | null,
        public readonly createdBy: string,
        public readonly createdAt: Date
    ) { }

    static create(input: CreateWorkflowInput & { id: string }): WorkflowEntity {
        if (!input.name || input.name.trim().length === 0) {
            throw new Error('Workflow name cannot be empty');
        }

        if (input.name.length > 255) {
            throw new Error('Workflow name cannot exceed 255 characters');
        }

        return new WorkflowEntity(
            input.id,
            input.orgId,
            input.name.trim(),
            input.description?.trim() || null,
            input.createdBy,
            new Date()
        );
    }

    rename(newName: string): WorkflowEntity {
        if (!newName || newName.trim().length === 0) {
            throw new Error('Workflow name cannot be empty');
        }

        return new WorkflowEntity(
            this.id,
            this.orgId,
            newName.trim(),
            this.description,
            this.createdBy,
            this.createdAt
        );
    }

    updateDescription(newDescription: string | null): WorkflowEntity {
        return new WorkflowEntity(
            this.id,
            this.orgId,
            this.name,
            newDescription?.trim() || null,
            this.createdBy,
            this.createdAt
        );
    }

    toObject(): Workflow {
        return {
            id: this.id,
            orgId: this.orgId,
            name: this.name,
            description: this.description,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
        };
    }
}
