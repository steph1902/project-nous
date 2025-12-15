import { Injectable } from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { UserAlreadyExistsError } from '../../domain/errors';

export interface CreateUserCommand {
    email: string;
    name: string;
}

export interface CreateUserResult {
    userId: string;
    email: string;
    name: string;
}

@Injectable()
export class CreateUserUseCase {
    constructor(
        private readonly userService: UserService,
        private readonly userRepository: UserRepository
    ) { }

    async execute(command: CreateUserCommand): Promise<CreateUserResult> {
        // Validate email format
        if (!this.userService.validateEmail(command.email)) {
            throw new Error('Invalid email format');
        }

        // Check if user already exists
        const existing = await this.userRepository.findByEmail(command.email);
        if (existing) {
            throw new UserAlreadyExistsError(command.email);
        }

        // Create user entity
        const user = this.userService.createUser({
            email: command.email,
            name: command.name,
        });

        // Persist
        await this.userRepository.save(user);

        return {
            userId: user.id,
            email: user.email,
            name: user.name,
        };
    }
}
