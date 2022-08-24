import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthService } from './auth/Auth.service';
import { RuntimeSubscriptionsService } from './bpmn/RuntimeSubscriptions.service';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

@Injectable()
export class WebsocketService implements OnApplicationBootstrap {
    private readonly logger = new RunboticsLogger(WebsocketService.name);

    constructor(
        private websocketAuth: AuthService,
        private runtimeSubscriptions: RuntimeSubscriptionsService,
    ) {}

    async onApplicationBootstrap() {
        this.runtimeSubscriptions.subscribeActivityEvents();
        this.runtimeSubscriptions.subscribeProcessEvents();
    }
}
