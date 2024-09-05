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
    decryptedCredentials?: DecryptedCredential[];
}

export interface KeepAliveStatus {
    intervalId: NodeJS.Timer;
    isActive: boolean;
}
