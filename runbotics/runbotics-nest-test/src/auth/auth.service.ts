import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = {
            username: 'testUser',
            password: 'secretPassword',
        }
        if (user && password && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException();
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload, {
                algorithm: 'HS512',
                secret: 'superSecretKey',
                expiresIn: '1h',
            }),
        };
    }
}
