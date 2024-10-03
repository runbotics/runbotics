import {
    UserTriggerData,
    ProcessInput,
    DecryptedCredential,
    TriggerEvent,
} from 'runbotics-common';

export interface StartProcessMessageBody {
    orchestratorProcessInstanceId: string;
    processId: number;
    input: ProcessInput;
    userId?: number;
    trigger: TriggerEvent;
    triggerData?: UserTriggerData;
    credentials: DecryptedCredential[];
}

export interface KeepAliveStatus {
    intervalId: NodeJS.Timeout;
    isActive: boolean;
}
