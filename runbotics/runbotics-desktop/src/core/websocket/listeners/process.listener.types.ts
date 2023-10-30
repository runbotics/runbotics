import { UserTriggerData, ITriggerEvent } from 'runbotics-common';

export interface StartProcessMessageBody {
    orchestratorProcessInstanceId: string;
    processId: number;
    input: any;
    userId?: number;
    trigger: ITriggerEvent;
    triggerData?: UserTriggerData;
}
