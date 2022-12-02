import { IProcessInstance } from 'runbotics-common';

export interface IBotStatus {
    runningProcesses: Record<string, IProcessInstance>;
}
