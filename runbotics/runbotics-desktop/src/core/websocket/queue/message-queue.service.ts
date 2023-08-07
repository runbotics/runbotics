import { Injectable } from '@nestjs/common';
import { InjectIoClientProvider, IoClient } from 'nestjs-io-client';
import {
    BotWsMessage,
    IProcessInstance,
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
} from 'runbotics-common';

export interface Message<
    T extends
        | BotWsMessage.PROCESS_INSTANCE
        | BotWsMessage.PROCESS_INSTANCE_EVENT
        | BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
> {
    event: T;
    payload: T extends BotWsMessage.PROCESS_INSTANCE
        ? IProcessInstance
        : T extends BotWsMessage.PROCESS_INSTANCE_EVENT
        ? IProcessInstanceEvent
        : T extends BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
        ? IProcessInstanceLoopEvent
        : never;
}

@Injectable()
export class MessageQueueService {
    private queue: Message<
        | BotWsMessage.PROCESS_INSTANCE
        | BotWsMessage.PROCESS_INSTANCE_EVENT
        | BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
    >[] = [];

    constructor(@InjectIoClientProvider() private readonly io: IoClient) {}

    add(
        item: Message<
            | BotWsMessage.PROCESS_INSTANCE
            | BotWsMessage.PROCESS_INSTANCE_EVENT
            | BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
        >
    ) {
        this.queue.push(item);
    }

    getAll(): Message<
        | BotWsMessage.PROCESS_INSTANCE
        | BotWsMessage.PROCESS_INSTANCE_EVENT
        | BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
    >[] {
        return this.queue;
    }

    remove(
        item: Message<
            | BotWsMessage.PROCESS_INSTANCE
            | BotWsMessage.PROCESS_INSTANCE_EVENT
            | BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT
        >
    ) {
        const number = this.queue.indexOf(item);
        this.queue.splice(number, 1);
    }

    clear() {
        this.queue = [];
    }

}
