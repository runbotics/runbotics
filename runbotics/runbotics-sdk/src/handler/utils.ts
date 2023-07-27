import { StatelessActionHandler } from './StatelessActionHandler';
import { StatefulActionHandler } from './StatefulActionHandler';

export enum ActionHandler {
    Stateful = 'StatefulActionHandler',
    Stateless = 'StatelessActionHandler',
};

export const isStatelessActionHandler = (
    handler: unknown
): handler is StatelessActionHandler => typeof handler === 'object'
    && 'getType' in handler
    && handler.getType
    && typeof handler.getType === 'function'
    && handler.getType() === ActionHandler.Stateless;

export const isStatefulActionHandler = (
    handler: unknown
): handler is StatefulActionHandler => typeof handler === 'object'
    && 'getType' in handler
    && typeof handler.getType === 'function'
    && handler.getType() === ActionHandler.Stateful
    && 'tearDown' in handler
    && typeof handler.tearDown === 'function';
