import { forwardRef, Module } from '@nestjs/common';
import { OutlookService } from './outlook';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { OneDriveService } from './one-drive';
import { SubscriptionService } from './subscription';
import { NotificationController, NotificationService } from './notification';
import { DatabaseModule } from 'src/database/database.module';
import { QueueModule } from 'src/queue/queue.module';
import { MicrosoftGraphService } from './microsoft-graph.service';

const services = [
    MicrosoftAuthService, OutlookService, OneDriveService, MicrosoftGraphService,
    SubscriptionService, NotificationService,
];

@Module({
    imports: [DatabaseModule, forwardRef(() => QueueModule)],
    controllers: [NotificationController],
    providers: services,
    exports: services,
})
export class MicrosoftModule {}
