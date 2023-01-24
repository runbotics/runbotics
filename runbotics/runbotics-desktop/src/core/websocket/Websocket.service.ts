import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { RuntimeSubscriptionsService } from './bpmn/runtime-subscriptions.service';
import { RunboticsLogger } from '#logger';

@Injectable()
export class WebsocketService implements OnApplicationBootstrap {
    private readonly logger = new RunboticsLogger(WebsocketService.name);

    constructor(
        private runtimeSubscriptions: RuntimeSubscriptionsService,
    ) {}

    async onApplicationBootstrap() {
        this.runtimeSubscriptions.subscribeActivityEvents();
        this.runtimeSubscriptions.subscribeProcessEvents();
    }
}
