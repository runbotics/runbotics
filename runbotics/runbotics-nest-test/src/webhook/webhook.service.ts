import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Like } from 'typeorm';
import { Webhook } from '../model/webhook/webhook.entity';
import { Token } from '../model/token/token.entity';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhookService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly httpService: HttpService,
    ) {}

    async register(body: Record<string, any>) {
        const webhookUrl = body.webhookUrl;
        const resources = body.data?.resources;
        const newWebhook = await this.dataSource.manager.save(Webhook, {
            rbUrl: webhookUrl,
            authorization: 'JWT',
            resources: resources ?? 'all',
            webhookId: body.webhookId,
        });

        return newWebhook;
    }

    async saveToken(tokenString: string): Promise<any> {
        const token = await this.dataSource.manager.findOne(Token, {});
        if (!token) {
            const newWebhookToken = await this.dataSource.manager.save(Token, {
                token: tokenString,
            });
        } else {
            await this.dataSource.manager.save(Token, {
                ...token,
                token: tokenString,
            });
        }
        return 'new token saved';
    }

    @Cron('45 * * * * *')
    async sendRequestToRB(): Promise<any> {
        console.log("sending cron request to RB");
        const registeredWebhook = await this.dataSource.manager.find(
            Webhook,
            {},
        );
        const token = await this.dataSource.manager.findOne(Token, {
            where: {
                token: Like('%ey%'),
            },
        });
        if (!token) {
            throw new InternalServerErrorException('No token found.');
        }
        for (const webhook of registeredWebhook) {
            const response = await firstValueFrom(this.httpService.post(
                webhook.rbUrl,
                {
                    data: {
                        webhookId: webhook.webhookId,
                        params: {
                            input: 'AttendedForm Process Log',
                        }
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token.token}`,
                    },
                },
            ));
            console.log(`${webhook.id} - ${webhook.rbUrl} response:`, response);
        }
    }
}
