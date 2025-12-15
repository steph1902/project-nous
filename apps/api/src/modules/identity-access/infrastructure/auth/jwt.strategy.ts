import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../persistence/user.repository';
import { OrgRepository } from '../persistence/org.repository';

export interface JwtPayload {
    sub: string; // userId
    email: string;
    orgId?: string;
}

export interface AuthUser {
    userId: string;
    email: string;
    orgId?: string;
    role?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,
        private readonly userRepository: UserRepository,
        private readonly orgRepository: OrgRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET'),
            issuer: config.get('JWT_ISSUER', 'agentops'),
        });
    }

    async validate(payload: JwtPayload): Promise<AuthUser> {
        const user = await this.userRepository.findById(payload.sub);

        if (!user) {
            return null as any;
        }

        const authUser: AuthUser = {
            userId: user.id,
            email: user.email,
        };

        // If orgId is in token, validate membership and add role
        if (payload.orgId) {
            const membership = await this.orgRepository.findMembership(
                payload.orgId,
                user.id
            );

            if (membership) {
                authUser.orgId = payload.orgId;
                authUser.role = membership.role;
            }
        }

        return authUser;
    }
}
