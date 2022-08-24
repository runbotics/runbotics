export interface StartProcessMessageBody {
    orchestratorProcessInstanceId: string;
    processId: number;
    input: any;
    userId: number;
    scheduled: boolean;
}
