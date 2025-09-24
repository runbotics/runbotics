import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '#/auth/auth.service';
import { Logger } from '#/utils/logger';
import { Public } from '#/auth/guards';
import { AuthGuestService } from '#/auth/auth-guest.service';

@Controller('/api/scheduler/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly authGuestService: AuthGuestService,
    ) {
    }

    @Public()
    @Post('authenticate')
    async authenticate(
        @Body() body: { username: string; password: string, rememberMe?: string },
        @Res() res: Response,
    ) {
        const newToken = await this.authService.authenticate(body.username, body.password, body.rememberMe === 'true');
        res.setHeader('Authorization', `Bearer ${newToken.idToken}`);
        res.status(200).json({ idToken: newToken.idToken, user: newToken.user });
    }

    @Public()
    @Post('authenticate/guest')
    async authenticateGuest(
        @Body() body: { langKey: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        this.logger.log('Authenticating guest user');
        const firstForwardedFor = Array.isArray(req.headers['x-forwarded-for']) ? 
            req.headers['x-forwarded-for']?.at(0) : 
            req.headers['x-forwarded-for']?.split(',')?.at(0);
        const remoteAddress = firstForwardedFor || req.ip || '';
        const verifiedGuests = await this.authGuestService.verifyGuestLimit(remoteAddress.toString());
        if (!verifiedGuests) {
            this.logger.warn(`Guest limit exceeded for IP: ${remoteAddress}`);
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Guest limit exceeded' });
        }
        const newGuest = await this.authGuestService.createGuestUser(remoteAddress.toString(), body.langKey);
        const guestJWTData = await this.authService.createGuestToken(newGuest);
        res.setHeader('Authorization', `Bearer ${guestJWTData.idToken}`);
        res.status(200).json({ idToken: guestJWTData.idToken, user: guestJWTData.user });
    }
}
