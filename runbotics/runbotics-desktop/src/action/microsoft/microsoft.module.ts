import { Module } from '@nestjs/common';

// TODO: delete
import { MicrosoftService } from './microsoft.service';
import { MicrosoftSession } from './microsoft.session';
//

import { MicrosoftAuthService } from './microsoft-auth.service';
import { MicrosoftGraphService } from './microsoft-graph';
import { SharePointService } from './share-point';
import { ExcelService } from './excel';
import { CloudExcelActionHandler } from './excel/automation';
import { OneDriveService } from './one-drive';

@Module({
    imports: [],
    providers: [
        CloudExcelActionHandler,
        SharePointService, ExcelService, OneDriveService,
        MicrosoftGraphService, MicrosoftAuthService,
        MicrosoftService, MicrosoftSession
    ],
    exports: [
        MicrosoftService, MicrosoftSession,
        CloudExcelActionHandler,
        SharePointService, ExcelService, OneDriveService,
    ],
})
export class MicrosoftModule {}
