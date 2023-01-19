import { StatefulActionHandler, StatelessActionHandler } from 'runbotics-sdk';
import { Worker } from 'worker_threads';

export interface ExternalHandler {
    module: string;
    handlerName: string;
}

export type ExternalHandlersMap = Map<string, ExternalHandler>;

export type InternalHandlerKey =
| 'api'
| 'application'
| 'asana'
| 'beeOffice'
| 'browser'
| 'csv'
| 'file'
| 'general'
| 'google'
| 'import'
| 'jira'
| 'loop'
| 'mail'
| 'javascript'
| 'typescript'
| 'sap'
| 'sharepointExcel'
| 'sharepointFile'
| 'variables';

export type InternalHandlersInstancesMap = HandlersInstancesMap<InternalHandlerKey>;

export type HandlersInstancesMap<T = string> = Map<T, StatelessActionHandler | StatefulActionHandler>;

export type ExternalActionWorkerMap = Map<string, Worker>;