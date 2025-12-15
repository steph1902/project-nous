import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UserRepository } from '../persistence/user.repository';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser } from '../auth/jwt.strategy';

class RegisterDto {
    email: string;
    name: string;
}

class LoginDto {
    email: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) { }

    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() dto: RegisterDto) {
        const result = await this.createUserUseCase.execute({
            email: dto.email,
            name: dto.name,
        });

        const token = this.jwtService.sign({
            sub: result.userId,
            email: result.email,
        });

        return {
            user: result,
            token,
        };
    }

    @Post('login')
    @Public()
    @ApiOperation({ summary: 'Login with email (simplified for demo)' })
    async login(@Body() dto: LoginDto) {
        const user = await this.userRepository.findByEmail(dto.email);

        if (!user) {
            throw new Error('User not found');
        }

        await this.userRepository.updateLastLogin(user.id);

        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });

        return {
            user: user.toObject(),
            token,
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user info' })
    async me(@CurrentUser() user: AuthUser) {
        const fullUser = await this.userRepository.findById(user.userId);
        return fullUser?.toObject();
    }
}
