import { StatelessActionHandler } from './StatelessActionHandler';
import { StatefulActionHandler } from './StatefulActionHandler';
import { StatelessStandalonePluginHandler } from './StatelessStandalonePluginHandler';
import { StatelessInjectablePluginHandler } from './StatelessInjectablePluginHandler';
import { StatefulStandalonePluginHandler } from './StatefulStandalonePluginHandler';
import { StatefulInjectablePluginHandler } from './StatefulInjectablePluginHandler';

type WithGetType = { getType: () => string };
type WithTearDown = { tearDown: () => Promise<void> };

export type PluginService =
    | StatelessInjectablePluginHandler
    | StatefulInjectablePluginHandler;

export const PLUGIN_SERVICE = 'pluginService';

export enum ActionHandler {
    Stateful = 'StatefulActionHandler',
    Stateless = 'StatelessActionHandler',
}

export enum PluginHandler {
    StatefulStandalone = 'StatefulStandalonePluginHandler',
    StatelessStandalone = 'StatelessStandalonePluginHandler',
    StatefulInjectable = 'StatefulInjectablePluginHandler',
    StatelessInjectable = 'StatelessInjectablePluginHandler',
}

const hasGetType = (handler: unknown): handler is WithGetType =>
    handler !== undefined &&
    handler !== null &&
    typeof handler === 'object' &&
    'getType' in handler &&
    handler.getType &&
    typeof handler.getType === 'function';

const hasTearDown = (handler: unknown): handler is WithTearDown =>
    handler !== undefined &&
    handler !== null &&
    typeof handler === 'object' &&
    'tearDown' in handler &&
    typeof handler.tearDown === 'function';

export const isStatelessActionHandler = (
    handler: unknown
): handler is StatelessActionHandler =>
    hasGetType(handler) && handler.getType() === ActionHandler.Stateless;

export const isStatelessStandalonePluginHandler = (
    handler: unknown
): handler is StatelessStandalonePluginHandler =>
    hasGetType(handler) &&
    handler.getType() === PluginHandler.StatelessStandalone;

export const isStatelessInjectablePluginHandler = (
    handler: unknown
): handler is StatelessInjectablePluginHandler =>
    hasGetType(handler) &&
    handler.getType() === PluginHandler.StatelessInjectable;

export const isStatefulActionHandler = (
    handler: unknown
): handler is StatefulActionHandler =>
    hasGetType(handler) &&
    handler.getType() === ActionHandler.Stateful &&
    hasTearDown(handler);

export const isStatefulStandalonePluginHandler = (
    handler: unknown
): handler is StatefulStandalonePluginHandler =>
    hasGetType(handler) &&
    handler.getType() === PluginHandler.StatefulStandalone &&
    hasTearDown(handler);

export const isStatefulInjectablePluginHandler = (
    handler: unknown
): handler is StatefulInjectablePluginHandler =>
    hasGetType(handler) &&
    handler.getType() === PluginHandler.StatefulInjectable &&
    hasTearDown(handler);

export const isPluginHandler = (handler: unknown) =>
    isStatelessStandalonePluginHandler(handler) ||
    isStatelessInjectablePluginHandler(handler) ||
    isStatefulStandalonePluginHandler(handler) ||
    isStatefulInjectablePluginHandler(handler);
