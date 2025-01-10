import { StatefulActionHandler, StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { Worker } from 'worker_threads';

// helper abstract class implementation type
export type ActionHandler = { new(): StatelessActionHandler | StatefulActionHandler };

export type ExternalHandlersMap = Map<string, any>;

export type InternalHandlerKey =
    | 'api'
    | 'ai'
    | 'application'
    | 'asana'
    | 'beeOffice'
    | 'browser'
    | 'csv'
    | 'file'
    | 'general'
    | 'google'
    | 'import'
    | 'jiraCloud'
    | 'jiraServer'
    | 'loop'
    | 'mail'
    | 'javascript'
    | 'typescript'
    | 'sap'
    | 'cloudExcel'
    | 'cloudFile'
    | 'variables'
    | 'excel'
    | 'desktop'
    | 'visualBasic'
    | 'image'
    | 'folder'
    | 'zip';

export type InternalHandlersInstancesMap = HandlersInstancesMap<InternalHandlerKey>;

export type HandlersInstancesMap<T = string> = Map<T, StatefulActionHandler | StatelessActionHandler>;

export type ExternalActionWorkerMap = Map<string, Worker>;
