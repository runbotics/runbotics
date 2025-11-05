import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { ModelModule } from './model/model.module';
import { WebhookModule } from './webhook/webhook.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, ConfigModule, ModelModule, WebhookModule,
      ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
