import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { ModelModule } from './model/model.module';

@Module({
  imports: [DatabaseModule, ConfigModule, ModelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
