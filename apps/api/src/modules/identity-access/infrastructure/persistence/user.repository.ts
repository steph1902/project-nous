import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        return new UserEntity(
            user.id,
            user.email,
            user.name,
            user.createdAt,
            user.lastLoginAt
        );
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) return null;

        return new UserEntity(
            user.id,
            user.email,
            user.name,
            user.createdAt,
            user.lastLoginAt
        );
    }

    async save(user: UserEntity): Promise<void> {
        await this.prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt,
            },
            update: {
                email: user.email,
                name: user.name,
                lastLoginAt: user.lastLoginAt,
            },
        });
    }

    async updateLastLogin(id: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
    }
}
