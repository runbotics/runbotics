import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [TypeOrmModule.forFeature([]), HttpModule, ConfigModule],
    controllers: [WebhookController],
    providers: [WebhookService],
})
export class WebhookModule {}
