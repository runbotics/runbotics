import { IProcess, IProcessInstance, IScheduleProcess } from 'runbotics-common';

export interface SchedulerState {
    loading: boolean;
    scheduledJobs: ScheduledJob[];
    activeJobs: IProcessInstance[];
    waitingJobs: SchedulerJob[];
}

export interface SchedulerJob {
    id: string;
    data: IScheduleProcess;
    name: string;
    attemptsMade: number;
    delay: number;
    progress: number;
    processedOn: number;
    finishedOn: unknown | null;
    returnValue: unknown | null;
    timestamp: number;
    opts: unknown;
}

export interface ScheduledJob {
    cron: string | null;
    endDate: string | null;
    every: number;
    id: string;
    key: string;
    name: string;
    next: number;
    process: IProcess;
    tz: string | null;
}
