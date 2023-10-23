import { RunboticsLogger } from '#logger';
import { IBpmnEngineEvent, ISubscription } from './runtime.types';

interface Handler<T> {
    (data: T): void
}

export class BpmnEngineEventBus<T> implements IBpmnEngineEvent<T> {
    private readonly logger = new RunboticsLogger(BpmnEngineEventBus.name);
    private handlers: Handler<T>[] = [];

    public subscribe(handler: Handler<T>): ISubscription {
        this.handlers.push(handler);
        return {
            unsubscribe: () => {
                this.unsubscribe(handler);
            },
        };
    }

    public unsubscribe(handler: Handler<T>) {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }

    public publish(data: T) {
        this.handlers.slice(0).forEach((handler) => {
            try {
                handler(data);
            } catch (e) {
                this.logger.error('Error in one of the handlers', e);
            }
        });
    }

    public expose(): BpmnEngineEventBus<T> {
        return this;
    }
}
