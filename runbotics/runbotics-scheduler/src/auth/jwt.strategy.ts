import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ServerConfigService } from '../config/serverConfig.service';
import { UserService } from '../database/user/user.service';
import { JWTPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private serverConfigService: ServerConfigService,
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: serverConfigService.secret,
            algorithms: ['HS512'],
        });
    }

    async validate(payload: JWTPayload) {
        return this.userService.findByLogin(payload.sub);
    }
}
