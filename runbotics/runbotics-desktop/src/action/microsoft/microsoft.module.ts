import { Module } from '@nestjs/common';

import { CloudExcelActionHandler } from './automation/excel';
import { CloudFileActionHandler } from './automation/file';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { MicrosoftGraphService } from './microsoft-graph';
import { SharePointService } from './share-point';
import { ExcelService } from './excel';
import { OneDriveService } from './one-drive';
import { ConfigModule } from '#config';

@Module({
    imports: [ ConfigModule ],
    providers: [
        MicrosoftGraphService, MicrosoftAuthService,
        CloudExcelActionHandler, CloudFileActionHandler,
        SharePointService, ExcelService, OneDriveService,
    ],
    exports: [
        CloudExcelActionHandler, CloudFileActionHandler,
        SharePointService, ExcelService, OneDriveService,
    ],
})
export class MicrosoftModule {}
