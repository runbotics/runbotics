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

@Module({
    imports: [],
    providers: [
        CloudExcelActionHandler,
        SharePointService, ExcelService,
        MicrosoftGraphService, MicrosoftAuthService,
        MicrosoftService, MicrosoftSession
    ],
    exports: [
        MicrosoftService, MicrosoftSession,
        CloudExcelActionHandler,
        SharePointService, ExcelService,
    ],
})
export class MicrosoftModule {}
