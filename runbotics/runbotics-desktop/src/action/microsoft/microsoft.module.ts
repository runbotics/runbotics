import { Module } from '@nestjs/common';

import { CloudExcelActionHandler } from './automation/excel';
import { CloudFileActionHandler } from './automation/file';
import { SharePointService } from './share-point';
import { ExcelService } from './excel';
import { OneDriveService } from './one-drive';
import { ConfigModule } from '#config';

@Module({
    imports: [ ConfigModule ],
    providers: [
        CloudExcelActionHandler, CloudFileActionHandler,
        SharePointService, ExcelService, OneDriveService,
    ],
    exports: [
        CloudExcelActionHandler, CloudFileActionHandler,
        SharePointService, ExcelService, OneDriveService,
    ],
})
export class MicrosoftModule {}
