import { StatelessActionHandler } from './StatelessActionHandler';
import { StatefulActionHandler } from './StatefulActionHandler';

export enum ActionHandler {
    Stateful = 'StatefulActionHandler',
    Stateless = 'StatelessActionHandler',
    StatefulMultithreaded = 'StatefulMultithreaded',
    StatelessMultithreaded = 'StatelessMultithreaded',
};

export const isStatelessActionHandler = (
    handler: unknown
): handler is StatelessActionHandler => typeof handler === 'object'
&& 'getType' in handler
&& handler.getType
&& typeof handler.getType === 'function'
    && [ActionHandler.Stateless, ActionHandler.StatelessMultithreaded].includes(handler.getType());

export const isStatefulActionHandler = (
    handler: unknown
): handler is StatefulActionHandler => typeof handler === 'object'
&& 'getType' in handler
&& typeof handler.getType === 'function'
&& [ActionHandler.Stateful, ActionHandler.StatefulMultithreaded].includes(handler.getType())
&& 'tearDown' in handler
    && typeof handler.tearDown === 'function';
