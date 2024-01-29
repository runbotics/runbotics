import { IProcess } from "./process.model";
import { IBot } from "./bot.model";
import { IUser } from "./user.model";
import { ITriggerEvent } from './trigger-event.model';

export interface IProcessInstance {
    id?: string;
    orchestratorProcessInstanceId?: string | null;
    rootProcessInstanceId?: string;
    status?: ProcessInstanceStatus | null;
    created?: string | null;
    updated?: string | null;
    input?: string | null;
    output?: string | null;
    step?: string | null;
    user?: IUser;
    process?: IProcess;
    bot?: IBot;
    error?: string | null;
    trigger?: ITriggerEvent;
    triggerData?: EmailTriggerData | UserTriggerData | unknown;
    warning?: boolean;
    callbackUrl?: string;
}

export type ProcessInstanceNotification = Pick<IProcessInstance,
    'status' |
    'output' |
    'process' |
    'error'
> & {
    started?: IProcessInstance['created'];
    finished?: IProcessInstance['updated'];
};

export interface EmailTriggerData {
    emailId: string;
    sender: string;
    ccRecipients?: string[];
    bccRecipients?: string[];
}

export interface UserTriggerData {
    userEmail?: string;
}

export enum ProcessInstanceStatus {
    INITIALIZING = 'INITIALIZING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ERRORED = 'ERRORED',
    STOPPED = 'STOPPED',
    TERMINATED = "TERMINATED",
}

export enum ProcessInstanceStep {
    START = 'event.start',
    END = 'event.end',
    ERROR_BOUNDARY = 'event.errorBoundary'
}

export const isEmailTriggerData = (data: unknown): data is EmailTriggerData => data
    && typeof data === 'object'
    && 'sender' in data
    && 'emailId' in data;
