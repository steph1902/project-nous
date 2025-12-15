import { Injectable } from '@nestjs/common';
import { OrgEntity, CreateOrgInput } from '../entities/org.entity';
import { OrgMemberEntity } from '../entities/org-member.entity';
import { Role } from '../value-objects/role.value-object';
import { generateOrgId } from '@nous/shared';

@Injectable()
export class OrgService {
    createOrg(input: CreateOrgInput): OrgEntity {
        const id = generateOrgId();
        return OrgEntity.create({ ...input, id });
    }

    createOwnerMembership(orgId: string, userId: string): OrgMemberEntity {
        return OrgMemberEntity.create(orgId, userId, Role.OWNER);
    }

    createMembership(orgId: string, userId: string, role: Role): OrgMemberEntity {
        return OrgMemberEntity.create(orgId, userId, role);
    }
}
