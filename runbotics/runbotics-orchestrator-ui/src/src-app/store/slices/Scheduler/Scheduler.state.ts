import {
    IProcess, IProcessInstance, UserDto, InstantProcess, ScheduledProcess,
} from 'runbotics-common';

export interface SchedulerState {
    loading: boolean;
    scheduledJobs: ScheduledJob[];
    activeJobs: IProcessInstance[];
    waitingJobs: QueueJob[];
}

export interface QueueJob {
    id: string;
    name: string;
    data: InstantProcess | ScheduledProcess;
    opts: JobOptions;
    progress: number;
    delay: number;
    timestamp: number;
    attemptsMade: number;
    stacktrace: unknown[];
    returnValue: unknown | null;
    finishedOn: number | null;
    processedOn: number;
}

interface JobOptions {
    repeat?: unknown;
    jobId: string;
    delay: number;
    timestamp: number;
    prevMilis: number;
    removeOnComplete: boolean;
    removeOnFail: boolean;
    attempts: number;
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
    user: UserDto;
    active: boolean;
}
