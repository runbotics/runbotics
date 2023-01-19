import { RunboticsLogger } from '#logger';
import { IBpmnEngineEvent, ISubscription } from './Runtime.types';

export class BpmnEngineEvent<T> implements IBpmnEngineEvent<T> {
    private handlers: { (data: T): void }[] = [];

    public subscribe(handler: { (data: T): void }): ISubscription {
        this.handlers.push(handler);
        const self = this;
        return {
            unsubscribe() {
                self.unsubscribe(handler);
            },
        };
    }

    public unsubscribe(handler: { (data: T): void }): void {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }

    public publish(data: T) {
        this.handlers.slice(0).forEach((h) => {
            try {
                h(data);
            } catch (e) {
                RunboticsLogger.print('error', ['Error in one of the handlers', e], 'Config', false);
            }
        });
    }

    public expose(): BpmnEngineEvent<T> {
        return this;
    }
}
