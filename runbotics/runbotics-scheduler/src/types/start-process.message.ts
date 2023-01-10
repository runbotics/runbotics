import { ProcessInput } from 'runbotics-common';

export interface StartProcessMessage {
    orchestratorProcessInstanceId: string;
    processId: string;
    input: ProcessInput;
    userId: number;
}
