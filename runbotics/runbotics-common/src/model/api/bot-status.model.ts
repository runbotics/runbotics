import { IProcessInstance } from "./process-instance.model";

export interface IBotStatus {
    runningProcesses: Record<string, IProcessInstance>;
}

export enum BotStatus {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTED = 'CONNECTED',
    BUSY = 'BUSY'
}
