import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { WebsocketModule } from './websocket/websocket.module';
import { DesktopRunnerService } from './bpm/desktop-runner';
import { RuntimeService } from './bpm/runtime';
import { ActionModule } from '#action';
import { LoopHandlerService } from './bpm/loop-handler';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        forwardRef(() => ActionModule),
        forwardRef(() => WebsocketModule),
    ],
    providers: [
        RuntimeService,
        DesktopRunnerService,
        LoopHandlerService
    ],
    exports: [
        RuntimeService,
    ],
})
export class CoreModule {}
