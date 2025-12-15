import { Injectable } from '@nestjs/common';
import { OrgService } from '../../domain/services/org.service';
import { OrgRepository } from '../../infrastructure/persistence/org.repository';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { OrgNotFoundError, UserNotFoundError } from '../../domain/errors';

export interface CreateOrgCommand {
    name: string;
    ownerId: string;
}

export interface CreateOrgResult {
    orgId: string;
    name: string;
}

@Injectable()
export class CreateOrgUseCase {
    constructor(
        private readonly orgService: OrgService,
        private readonly orgRepository: OrgRepository,
        private readonly userRepository: UserRepository
    ) { }

    async execute(command: CreateOrgCommand): Promise<CreateOrgResult> {
        // Verify owner exists
        const owner = await this.userRepository.findById(command.ownerId);
        if (!owner) {
            throw new UserNotFoundError(command.ownerId);
        }

        // Create org entity
        const org = this.orgService.createOrg({ name: command.name });

        // Create owner membership
        const membership = this.orgService.createOwnerMembership(org.id, command.ownerId);

        // Persist
        await this.orgRepository.save(org);
        await this.orgRepository.saveMembership(membership);

        return {
            orgId: org.id,
            name: org.name,
        };
    }
}
