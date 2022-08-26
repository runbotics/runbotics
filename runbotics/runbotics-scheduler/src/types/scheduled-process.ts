import { IProcess, IUser } from 'runbotics-common';
import { InstantProcess } from './instant-process';

export interface ScheduledProcess extends InstantProcess {
    id: number;
    cron: string;
}

export interface ValidateProcessAccessProps { process: IProcess, user: IUser, triggerable?: boolean }