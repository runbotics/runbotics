import { Body, Controller, Post, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('api/webhook')
export class WebhookController {
    
    constructor(private readonly webhookService: WebhookService) {}
    
    @Post('register')
    async registerWebhook(@Body() body: Record<string, any>, @Req() req: Request) {
        console.log(req.body, req.headers);
        return this.webhookService.register(body);
    }
    
    @Post('token')
    async token(@Body() body: {token: string},): Promise<any>{
        return this.webhookService.saveToken(body.token);
    }
    
    
}
