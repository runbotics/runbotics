import { Module } from '@nestjs/common';
import { MicrosoftService } from './microsoft.service';
import { MicrosoftSession } from './microsoft.session';
import { MicrosoftAuthService } from './microsoft-auth.service';
import { MicrosoftGraphService } from './microsoft-graph';
import { SharePointService } from './file/service/share-point';
import { ExcelService } from './excel';

@Module({
    imports: [],
    providers: [
        SharePointService, ExcelService,
        MicrosoftGraphService, MicrosoftAuthService, MicrosoftService, MicrosoftSession
    ],
    exports: [MicrosoftService, MicrosoftSession],
})
export class MicrosoftModule {}
