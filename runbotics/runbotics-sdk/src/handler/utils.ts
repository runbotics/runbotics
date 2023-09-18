import { StatelessActionHandler } from './StatelessActionHandler';
import { StatefulActionHandler } from './StatefulActionHandler';

export enum ActionHandler {
    Stateful = 'StatefulActionHandler',
    Stateless = 'StatelessActionHandler',
    MultithreadStateful = 'MultithreadStatefulActionHandler',
    MultithreadStateless = 'MultithreadStatelessActionHandler',
};

export const isStatelessActionHandler = (
    handler: unknown
): handler is StatelessActionHandler => handler !== undefined
    && handler !== null
    && typeof handler === 'object'
    && 'getType' in handler
    && handler.getType
    && typeof handler.getType === 'function'
    && ActionHandler.Stateless === handler.getType();

export const isStatefulActionHandler = (
    handler: unknown
): handler is StatefulActionHandler => handler !== undefined
    && handler !== null
    && typeof handler === 'object'
    && 'getType' in handler
    && typeof handler.getType === 'function'
    && 'tearDown' in handler
    && typeof handler.tearDown === 'function'
    &&  ActionHandler.Stateful === handler.getType();


export const isMultithreadStatelessActionHandler = (
    handler: unknown
): handler is StatelessActionHandler => handler !== undefined
    && handler !== null
    && typeof handler === 'object'
    && 'getType' in handler
    && handler.getType
    && typeof handler.getType === 'function'
    && ActionHandler.MultithreadStateless === handler.getType();

export const isMultithreadStatefulActionHandler = (
    handler: unknown
): handler is StatefulActionHandler => handler !== undefined
    && handler !== null
    && typeof handler === 'object'
    && 'getType' in handler
    && typeof handler.getType === 'function'
    && 'tearDown' in handler
    && typeof handler.tearDown === 'function'
    && ActionHandler.MultithreadStateful === handler.getType();
