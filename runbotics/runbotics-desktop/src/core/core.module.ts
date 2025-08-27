import { forwardRef, Module } from '@nestjs/common';

import { WebsocketModule } from './websocket/websocket.module';
import { DesktopRunnerService } from './bpm/desktop-runner';
import { RuntimeService } from './bpm/runtime';
import { ActionModule } from '#action';
import { RuntimeSubscriptionsService } from './websocket/bpmn/runtime-subscriptions.service';
import { LoopHandlerService } from './bpm/loop-handler';
import { AuthModule } from './auth/auth.module';
import { HeapMonitorService } from './monitoring/heap-monitor.service';


@Module({
    imports: [
        forwardRef(() => ActionModule),
        forwardRef(() => WebsocketModule),
        forwardRef(() => AuthModule),
    ],
    providers: [
        RuntimeService,
        DesktopRunnerService,
        RuntimeSubscriptionsService,
        LoopHandlerService,
        HeapMonitorService,
    ],
    exports: [
        RuntimeService,
        DesktopRunnerService,
        HeapMonitorService,
    ],
})
export class CoreModule {}
