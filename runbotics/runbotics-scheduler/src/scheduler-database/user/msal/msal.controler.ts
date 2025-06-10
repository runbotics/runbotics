import { BadRequestException, Controller, Get, Post, Redirect, Req, Res } from '@nestjs/common';
import { MsalService } from './msal.service';
import { Request, Response } from 'express';
import { UserService } from '../user.service';
import { AuthService } from '#/auth/auth.service';

@Controller('/api/scheduler/msal')
export class MsalController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly msalService: MsalService
    ) {}

    @Get('/begin')
    async begin() {
        const data = await this.msalService.beginLogin();

        return Redirect(data.url, 302)
    }

    @Post('/callback')
    async callback(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const code = req.body.code;
        const res = await this.msalService.handleLoginCallback({ code })

        const profileData = await this.msalService.fetchProfileData(res.accessToken);
        if (!profileData) { 
            throw new BadRequestException(`Given Azure user has no email`);
        }

        const authToken = await this.authService.handleMsalSsoAuth({
            email: profileData.email,
            langKey: 'en',
            msTenantId: res.tenantId,
        })

        response
            .cookie('token', authToken)
            .status(200)
        
        return {
            token: authToken
        }
    }
}
