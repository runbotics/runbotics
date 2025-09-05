import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '#/auth/auth.service';
import { Logger } from '#/utils/logger';
import { Public } from '#/auth/guards';

@Controller('/api/scheduler/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {
    }

    @Public()
    @Post('authenticate')
    async authenticate(
        @Body() body: { username: string; password: string, rememberMe?: string },
        @Res() res: Response,
    ) {
        const newToken = await this.authService.authenticate(body.username, body.password, body.rememberMe === 'true');

        res.setHeader('Authorization', `Bearer ${newToken.idToken}`);
        res.status(200).json(newToken);
    }
}
