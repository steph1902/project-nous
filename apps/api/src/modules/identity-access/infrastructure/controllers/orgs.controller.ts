import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrgUseCase } from '../../application/use-cases/create-org.use-case';
import { OrgRepository } from '../persistence/org.repository';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../../domain/value-objects/role.value-object';
import { AuthUser } from '../auth/jwt.strategy';

class CreateOrgDto {
    name: string;
}

@ApiTags('Organizations')
@Controller('orgs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrgsController {
    constructor(
        private readonly createOrgUseCase: CreateOrgUseCase,
        private readonly orgRepository: OrgRepository
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new organization' })
    async create(@Body() dto: CreateOrgDto, @CurrentUser() user: AuthUser) {
        const result = await this.createOrgUseCase.execute({
            name: dto.name,
            ownerId: user.userId,
        });

        return result;
    }

    @Get()
    @ApiOperation({ summary: 'List organizations for current user' })
    async list(@CurrentUser() user: AuthUser) {
        const orgs = await this.orgRepository.findByUserId(user.userId);
        return orgs.map((org) => org.toObject());
    }

    @Get(':orgId')
    @ApiOperation({ summary: 'Get organization by ID' })
    async get(@Param('orgId') orgId: string, @CurrentUser() user: AuthUser) {
        const org = await this.orgRepository.findById(orgId);

        if (!org) {
            throw new Error('Organization not found');
        }

        // Verify membership
        const membership = await this.orgRepository.findMembership(orgId, user.userId);
        if (!membership) {
            throw new Error('Access denied');
        }

        return org.toObject();
    }

    @Get(':orgId/members')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'List organization members' })
    async getMembers(@Param('orgId') orgId: string) {
        const members = await this.orgRepository.getMembers(orgId);
        return members.map((m) => m.toObject());
    }
}
