import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { MsalService } from './msal.service';
import { Request, Response } from 'express';
import { Public } from '#/auth/guards';
import { MsalLoginError } from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { MsalAuthError } from './msal.error';
const MSAL_FRONTEND_CALLBACK_URL = '/msal/callback';

@Controller('/scheduler/msal')
export class MsalController {
    private readonly logger = new Logger(MsalController.name);

    constructor(
        private readonly msalService: MsalService
    ) {
    }

    @Public()
    @Get('/begin')
    async begin(
        @Res() res: Response
    ) {
        this.msalService.ensureSsoEnabled();
        const data = await this.msalService.beginLogin();
        res.status(302).redirect(data.url);
    }

    @Public()
    @Post('/callback')
    async callback(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response
    ) {
        this.msalService.ensureSsoEnabled();
        const code = req.body.code;

        let authToken: string;
        try {
            authToken = await this.msalService.ssoAuth({ code });
        } catch (e) {
            this.logger.error('Failed to authenticate MSAL user', e);
            
            let errorType = MsalLoginError.MSAL_TOKEN_EXCHANGE_ERROR;
            if (e instanceof MsalAuthError) {
                errorType = e.msalErrorType;
            }
            
            return response.status(302).redirect(`${MSAL_FRONTEND_CALLBACK_URL}?error=${encodeURIComponent(errorType)}`);
        }

        return response
            .cookie('msal_token_transfer', authToken)
            .status(302)
            .redirect(MSAL_FRONTEND_CALLBACK_URL);
    }
}
