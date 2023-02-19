import { Module } from '@nestjs/common';
import { OutlookService } from './outlook.service';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { OneDriveService } from './one-drive.service';
import { NotificationController, SubscriptionService } from './subscription';
import { FileUploadService } from './file-upload.service';

const services = [
    MicrosoftAuthService, OutlookService, OneDriveService, SubscriptionService, FileUploadService,
];

@Module({
    controllers: [NotificationController],
    providers: services,
    exports: services,
})
export class MicrosoftModule {}
