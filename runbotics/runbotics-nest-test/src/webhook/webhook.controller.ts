import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { BasicAuthGuard } from '../auth/guards/basic.guard';

@Controller('api/webhook')
export class WebhookController {
    
    constructor(private readonly webhookService: WebhookService) {}
    
    @Post('register/none')
    async registerWebhookNone(@Body() body: Record<string, any>, @Req() req: Request) {
        return this.webhookService.register(body);
    }

    @Post('register/jwt')
    @UseGuards(JwtAuthGuard)
    async registerWebhookJwt(@Body() body: Record<string, any>, @Req() req: Request) {
        return this.webhookService.register(body);
    }
    @Post('register/basic')
    @UseGuards(BasicAuthGuard)
    async registerWebhookBasic(@Body() body: Record<string, any>, @Req() req: Request) {
        return this.webhookService.register(body);
    }
    
    @Post('token')
    async token(@Body() body: {token: string},): Promise<any>{
        return this.webhookService.saveToken(body.token);
    }
    
    
}
