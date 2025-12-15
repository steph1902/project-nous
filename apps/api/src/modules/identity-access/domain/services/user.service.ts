import { Injectable } from '@nestjs/common';
import { UserEntity, CreateUserInput } from '../entities/user.entity';
import { generateUserId } from '@nous/shared';

@Injectable()
export class UserService {
    createUser(input: CreateUserInput): UserEntity {
        const id = generateUserId();
        return UserEntity.create({ ...input, id });
    }

    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
