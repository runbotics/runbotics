import {
    UserTriggerData,
    ITriggerEvent,
    ProcessInput,
    DecryptedCredential,
} from 'runbotics-common';

export interface StartProcessMessageBody {
    orchestratorProcessInstanceId: string;
    processId: number;
    input: ProcessInput;
    userId?: number;
    trigger: ITriggerEvent;
    triggerData?: UserTriggerData;
    credentials: DecryptedCredential[];
}

export interface KeepAliveStatus {
    intervalId: NodeJS.Timeout;
    isActive: boolean;
}
