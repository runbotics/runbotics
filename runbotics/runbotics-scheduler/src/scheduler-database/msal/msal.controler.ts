import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { MsalService } from './msal.service';
import { Request, Response } from 'express';
import { AuthService } from '#/auth/auth.service';
import { Public } from '#/auth/guards';
import { MsalLoginError } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { MsalProfileData } from './msal.types';
const MSAL_FRONTEND_CALLBACK_URL = '/msal/callback';

@Controller('/scheduler/msal')
export class MsalController {
    private readonly logger = new Logger(MsalController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly msalService: MsalService
    ) {
    }

    @Public()
    @Get('/begin')
    async begin(
        @Res() res: Response
    ) {
        const data = await this.msalService.beginLogin();
        res.status(302).redirect(data.url);
    }

    @Public()
    @Post('/callback')
    async callback(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        const code = req.body.code;
        const loginResponse = await this.msalService.handleLoginCallback({ code });

        let profileData: MsalProfileData;
        try {
            profileData = await this.msalService.fetchProfileData(loginResponse.accessToken);
            if (!profileData.email) {
                return response.status(302).redirect(`${MSAL_FRONTEND_CALLBACK_URL}?error=${encodeURIComponent(MsalLoginError.BAD_EMAIL)}`);
            }
        } catch (e) {
            this.logger.error('MSAL login finalization filed', e);
            return response.status(302).redirect(`${MSAL_FRONTEND_CALLBACK_URL}?error=${encodeURIComponent(MsalLoginError.TOKEN_ISSUE_FILED)}`);
        }

        let authToken: string;
        try {
            authToken = await this.authService.handleMsalSsoAuth({
                email: profileData.email,
                langKey: profileData.langKey,
                msTenantId: loginResponse.tenantId,
            });
        } catch (e) {
            this.logger.error('Filed to login MSAL-authenticated user to RB', e);
            return response.status(302).redirect(`${MSAL_FRONTEND_CALLBACK_URL}?error=${encodeURIComponent(MsalLoginError.MSAL_TOKEN_EXCHANGE_ERROR)}`);
        }

        return response
            .cookie('msal_token_transfer', authToken)
            .status(302)
            .redirect(MSAL_FRONTEND_CALLBACK_URL);
    }
}
