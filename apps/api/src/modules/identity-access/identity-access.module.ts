import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Domain
import { UserService } from './domain/services/user.service';
import { OrgService } from './domain/services/org.service';

// Application
import { CreateOrgUseCase } from './application/use-cases/create-org.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { ValidateApiKeyUseCase } from './application/use-cases/validate-api-key.use-case';

// Infrastructure
import { UserRepository } from './infrastructure/persistence/user.repository';
import { OrgRepository } from './infrastructure/persistence/org.repository';
import { ApiKeyRepository } from './infrastructure/persistence/api-key.repository';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { OrgsController } from './infrastructure/controllers/orgs.controller';
import { UsersController } from './infrastructure/controllers/users.controller';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from './infrastructure/auth/roles.guard';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get('JWT_EXPIRES_IN', '7d'),
                    issuer: config.get('JWT_ISSUER', 'agentops'),
                },
            }),
        }),
    ],
    controllers: [AuthController, OrgsController, UsersController],
    providers: [
        // Domain Services
        UserService,
        OrgService,

        // Use Cases
        CreateOrgUseCase,
        CreateUserUseCase,
        ValidateApiKeyUseCase,

        // Repositories (Ports implementation)
        UserRepository,
        OrgRepository,
        ApiKeyRepository,

        // Auth
        JwtStrategy,
        JwtAuthGuard,
        RolesGuard,
    ],
    exports: [JwtAuthGuard, RolesGuard, UserService, OrgService],
})
export class IdentityAccessModule { }
