import { ProcessInput } from './instant-process';

export interface StartProcessMessage {
    orchestratorProcessInstanceId: string;
    processId: string;
    input: ProcessInput;
    userId: number;
}
