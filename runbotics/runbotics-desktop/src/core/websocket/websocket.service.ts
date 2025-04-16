import { Inject, Injectable, OnApplicationBootstrap, forwardRef, HttpStatus } from '@nestjs/common';
import { RuntimeSubscriptionsService } from './bpmn/runtime-subscriptions.service';
import { RunboticsLogger } from '#logger';
import { Message, MessageQueueService } from './queue/message-queue.service';
import { ProcessInstanceEventStatus } from 'runbotics-common';
import { InjectIoClientProvider, IoClient } from 'nestjs-io-client';

@Injectable()
export class WebsocketService implements OnApplicationBootstrap {
    private readonly logger = new RunboticsLogger(WebsocketService.name);

    constructor(
        @Inject(forwardRef(()=>RuntimeSubscriptionsService))
        private runtimeSubscriptions: RuntimeSubscriptionsService,
        @InjectIoClientProvider() private io: IoClient,
        private messageService: MessageQueueService
    ) {}

    async onApplicationBootstrap() {
        this.runtimeSubscriptions.subscribeActivityEvents();
        this.runtimeSubscriptions.subscribeProcessEvents();
    }

    async emitMessage(
        message: Message, isReconnected?: boolean
    ) {
        if (!isReconnected)
            this.messageService.add(message);

        this.io.emit(message.event, message.payload, (responseHttpStatus: number) => {
            if(responseHttpStatus !== HttpStatus.OK) {
                this.logger.log(`Recieved response with HTTP status: [${responseHttpStatus}]`);
            }
            if(message.payload?.status !== ProcessInstanceEventStatus.IN_PROGRESS) {
                this.messageService.clear();
                return;
            }
            this.messageService.remove(message);
        });
    }

    async emitMessageWithoutQueue(
        message: Message
    ) {
        this.io.emit(message.event, message.payload);
    }
}
