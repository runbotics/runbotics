import { UserTriggerData, ITriggerEvent, ProcessInput } from 'runbotics-common';

export interface StartProcessMessageBody {
    orchestratorProcessInstanceId: string;
    processId: number;
    input: ProcessInput;
    userId?: number;
    trigger: ITriggerEvent;
    triggerData?: UserTriggerData;
}

export interface KeepAliveStatus {
    intervalId: NodeJS.Timer;
    isActive: boolean;
}
