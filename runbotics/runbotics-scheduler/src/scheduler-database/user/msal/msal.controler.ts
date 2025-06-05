import { Controller, Get, Req } from '@nestjs/common';
import { MsalService } from './msal.service';
import { Request } from 'express';

@Controller('/api/scheduler/msal')
export class MsalController {
    constructor(private readonly msalService: MsalService) {}

    @Get('/begin')
    async begin(
        @Req() req: Request
    ) {
        const data = this.msalService.beginLogin();

        return data;
    }
}
