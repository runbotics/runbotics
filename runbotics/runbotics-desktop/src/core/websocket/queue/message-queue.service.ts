import { Injectable } from '@nestjs/common';
import { InjectIoClientProvider, IoClient } from 'nestjs-io-client';
import {
    BotWsMessage,
    IProcessInstance,
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
} from 'runbotics-common';

export type Message =
    | {
          event: BotWsMessage.PROCESS_INSTANCE;
          payload: IProcessInstance;
      }
    | {
          event: BotWsMessage.PROCESS_INSTANCE_EVENT;
          payload: IProcessInstanceEvent;
      }
    | {
          event: BotWsMessage.PROCESS_INSTANCE_LOOP_EVENT;
          payload: IProcessInstanceLoopEvent;
      }
    | {
          event: BotWsMessage.KEEP_ALIVE;
          payload: null;
      };

@Injectable()
export class MessageQueueService {
    private queue: Message[] = [];

    constructor(@InjectIoClientProvider() private readonly io: IoClient) {}

    add(item: Message) {
        this.queue.push(item);
    }

    getAll(): Message[] {
        return this.queue;
    }

    remove(item: Message) {
        const number = this.queue.indexOf(item);
        this.queue.splice(number, 1);
    }

    clear() {
        this.queue = [];
    }
}
