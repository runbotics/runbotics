import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ServerConfigService } from '../config/server-config/server-config.service';
import { UserService } from '../scheduler-database/user/user.service';
import { JWTPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly serverConfigService: ServerConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: serverConfigService.secret,
            algorithms: ['HS512'],
        });
    }

    async validate(payload: JWTPayload) {
        return this.userService.findByEmail(payload.sub);
    }
}
