/**
 * OrgMember Entity - Association between User and Org with Role
 */
import { Role } from '../value-objects/role.value-object';

export interface OrgMember {
    orgId: string;
    userId: string;
    role: Role;
    createdAt: Date;
}

export class OrgMemberEntity {
    constructor(
        public readonly orgId: string,
        public readonly userId: string,
        public readonly role: Role,
        public readonly createdAt: Date
    ) { }

    static create(orgId: string, userId: string, role: Role): OrgMemberEntity {
        return new OrgMemberEntity(orgId, userId, role, new Date());
    }

    changeRole(newRole: Role): OrgMemberEntity {
        return new OrgMemberEntity(
            this.orgId,
            this.userId,
            newRole,
            this.createdAt
        );
    }

    isOwner(): boolean {
        return this.role === Role.OWNER;
    }

    isAdmin(): boolean {
        return this.role === Role.ADMIN || this.role === Role.OWNER;
    }

    canManageWorkflows(): boolean {
        return this.role !== Role.VIEWER;
    }

    toObject(): OrgMember {
        return {
            orgId: this.orgId,
            userId: this.userId,
            role: this.role,
            createdAt: this.createdAt,
        };
    }
}
