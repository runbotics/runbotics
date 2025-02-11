import { forwardRef, Module } from '@nestjs/common';
import { OutlookService } from './outlook';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { OneDriveService } from './one-drive';
import { SubscriptionService } from './subscription';
import { NotificationController, NotificationService } from './notification';
import { DatabaseModule } from '#/database/database.module';
import { QueueModule } from '#/queue/queue.module';
import { MicrosoftGraphService } from './microsoft-graph/microsoft-graph.service';
import { TenantModule } from '#/scheduler-database/tenant/tenant.module';

const services = [
    MicrosoftAuthService, OutlookService, OneDriveService, MicrosoftGraphService,
    SubscriptionService, NotificationService,
];

@Module({
    imports: [DatabaseModule, forwardRef(() => QueueModule), TenantModule],
    controllers: [NotificationController],
    providers: services,
    exports: services,
})
export class MicrosoftModule {}
