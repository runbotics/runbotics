import { Module } from '@nestjs/common';
import { MicrosoftService } from './microsoft.service';
import { MicrosoftSession } from './microsoft.session';

@Module({
    imports: [],
    exports: [MicrosoftService, MicrosoftSession],
    providers: [MicrosoftService, MicrosoftSession],
})
export class MicrosoftModule {}
