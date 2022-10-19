import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { StorageService } from './utils/storage.service';
import { Logger } from './utils/logger';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';

@Global()
@Module({
    imports: [
        AuthModule,
        ConfigModule,
        DatabaseModule,
        QueueModule,
    ],
    providers: [
        StorageService, Logger
    ],
})
export class AppModule { }
