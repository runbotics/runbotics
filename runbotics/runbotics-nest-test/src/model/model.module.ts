import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webhook } from './webhook/webhook.entity';
import { Token } from './token/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Webhook, Token])],
})
export class ModelModule {}
