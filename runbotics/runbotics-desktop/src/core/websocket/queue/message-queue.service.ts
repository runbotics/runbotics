import { Injectable } from '@nestjs/common';
import { InjectIoClientProvider, IoClient } from 'nestjs-io-client';
import { BotWsMessage } from 'runbotics-common';

export interface Queue {
    event:
        | BotWsMessage.PROCESS_INSTANCE_EVENT
        | BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
        | BotWsMessage.PROCESS_INSTANCE;
    payload: any;
}

@Injectable()
export class MessageQueueService {
    constructor(@InjectIoClientProvider() private readonly io: IoClient) {}

    private queue: Queue[] = [];

    addToQueue(item: Queue) {
        this.queue.push(item);
    }

    getQueue(): Queue[] {
        return this.queue;
    }

    clear() {
        this.queue = [];
    }

    removeFromQueue(item: Queue) {
        const number = this.queue.indexOf(item);
        this.queue.splice(number, 1);
    }

    async handleEmit(queueElement: Queue) {
        this.io.emit(queueElement.event, queueElement.payload, () => {
            this.removeFromQueue(queueElement);
        });
    }
}
