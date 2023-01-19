import { StatefulActionHandler, StatelessActionHandler } from 'runbotics-sdk';

export interface ExternalHandler {
    package?: string;
    handler: string;
}

export type ExternalHandlers = Record<string, ExternalHandler>;

export type Handlers = Record<string, StatelessActionHandler | StatefulActionHandler>;
