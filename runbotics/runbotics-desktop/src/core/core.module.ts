import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { WebsocketModule } from './websocket/websocket.module';
import { DesktopRunnerService } from './bpm/desktop-runner';
import { RuntimeService } from './bpm/runtime';
import { ActionModule } from '#action';
import { RuntimeSubscriptionsService } from './websocket/bpmn/runtime-subscriptions.service';
import { LoopHandlerService } from './bpm/loop-handler';
import { QueueService } from './websocket/queue/message-queue.service';


@Module({
    imports: [
        ScheduleModule.forRoot(),
        forwardRef(() => ActionModule),
        forwardRef(() => WebsocketModule),
    ],
    providers: [
        RuntimeService,
        DesktopRunnerService,
        RuntimeSubscriptionsService,
        LoopHandlerService,
        QueueService
    ],
    exports: [
        RuntimeService,
        DesktopRunnerService,
        RuntimeSubscriptionsService,
        QueueService
    ],
})
export class CoreModule {}
