import { ProcessTrigger } from 'runbotics-common';

export interface StartProcessMessageBody {
    orchestratorProcessInstanceId: string;
    processId: number;
    input: any;
    userId?: number;
    trigger: ProcessTrigger;
    triggeredBy?: string;
}
