/**
 * Org Entity - Organization aggregate root
 * 
 * Invariants:
 * - Org must have at least one Owner
 * - Org name cannot be empty
 */
export interface Org {
    id: string;
    name: string;
    createdAt: Date;
}

export interface CreateOrgInput {
    name: string;
}

export class OrgEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly createdAt: Date
    ) { }

    static create(input: CreateOrgInput & { id: string }): OrgEntity {
        if (!input.name || input.name.trim().length === 0) {
            throw new Error('Organization name cannot be empty');
        }

        return new OrgEntity(
            input.id,
            input.name.trim(),
            new Date()
        );
    }

    rename(newName: string): OrgEntity {
        if (!newName || newName.trim().length === 0) {
            throw new Error('Organization name cannot be empty');
        }

        return new OrgEntity(
            this.id,
            newName.trim(),
            this.createdAt
        );
    }

    toObject(): Org {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
        };
    }
}
