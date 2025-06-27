import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthModule } from './auth/auth.module';
import { StorageService } from './utils/storage.service';
import { Logger } from './utils/logger';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';
import { MailTriggerModule } from './mail-trigger/mail-trigger.module';
import { WebsocketModule } from './websocket/websocket.module';
import { SchedulerDatabaseModule } from './scheduler-database/scheduler-database.module';
import { ProcessCollectionsModule } from './process-collections/process-collections.module';
import { PermissionCheckModule } from './process-collections/permission-check/permission-check.module';

@Module({
    imports: [
        AuthModule,
        DatabaseModule,
        QueueModule,
        MailTriggerModule,
        WebsocketModule,
        SchedulerDatabaseModule,
        PrometheusModule.register(),
        ProcessCollectionsModule,
        PermissionCheckModule,
    ],
    providers: [
        StorageService, Logger,
    ],
})
export class AppModule {
}
