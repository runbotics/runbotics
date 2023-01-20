import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { WebsocketModule } from './websocket/websocket.module';
import { DesktopRunnerService } from './bpm/DesktopRunner';
import { RuntimeService } from './bpm/Runtime';
import { ActionModule } from '#action';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        forwardRef(() => ActionModule),
        forwardRef(() => WebsocketModule),
    ],
    providers: [
        RuntimeService,
        DesktopRunnerService,
    ],
    exports: [
        RuntimeService,
    ],
})
export class CoreModule {}
