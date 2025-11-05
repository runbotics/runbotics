import { BasicStrategy as BasicStrategyClass } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(BasicStrategyClass) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        return this.authService.validateUser(username, password);
    }
}
