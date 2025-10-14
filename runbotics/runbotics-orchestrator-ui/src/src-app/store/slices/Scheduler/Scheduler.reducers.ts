import { PayloadAction } from '@reduxjs/toolkit';
import { IProcessInstance, IProcessInstanceEvent, IScheduleProcess } from 'runbotics-common';

import { QueueJob, SchedulerState, ScheduledJob } from './Scheduler.state';

export const deleteWaitingJob = (state: SchedulerState, action: PayloadAction<IScheduleProcess>) => {
    state.waitingJobs = state.waitingJobs.filter((job) => job.id !== action.payload.id.toString());
};

export const addWaitingJob = (state: SchedulerState, action: PayloadAction<QueueJob>) => {
    const isUpdate = state.waitingJobs.find(({ id }) => id === action.payload.id);
    if (isUpdate) 
    { state.waitingJobs = state.waitingJobs.map(
        (waitingJob) => (waitingJob.id === action.payload.id ? action.payload : waitingJob),
    ); }
    else { state.waitingJobs = [...state.waitingJobs, action.payload]; }
};

export const addActiveJob = (state: SchedulerState, action: PayloadAction<IProcessInstance>) => {
    const newActiveJobs = state.activeJobs.filter((job) => job.id !== action.payload.id);
    state.activeJobs = [...newActiveJobs, action.payload];
};

export const removeActiveJob = (state: SchedulerState, action: PayloadAction<IProcessInstance>) => {
    state.activeJobs = state.activeJobs.filter((process) => process.id !== action.payload.id);
};

export const removeActiveJobById = (state: SchedulerState, action: PayloadAction<string>) => {
    state.activeJobs = state.activeJobs.filter((process) => process.id !== action.payload);
};

export const updateActiveJob = (state: SchedulerState, action: PayloadAction<IProcessInstanceEvent>) => {
    state.activeJobs = state.activeJobs.map((process) => (process.id === action.payload.processInstance.id ? {
        ...process,
        step: action.payload.step ?? process.step,
    } : process));
};

export const removeScheduledProcess = (state: SchedulerState, action: PayloadAction<ScheduledJob['id']>) => {
    state.scheduledJobs = state.scheduledJobs.filter((job) => job.id !== action.payload);
};

export const addScheduledProcess = (state: SchedulerState, action: PayloadAction<ScheduledJob>) => {
    state.scheduledJobs = [...state.scheduledJobs, action.payload];
};

export const updateScheduledProcess = (state: SchedulerState, action: PayloadAction<Partial<ScheduledJob>>) => {
    state.scheduledJobs = state.scheduledJobs.map((job) => (job.id === action.payload.id ? {...job, ...action.payload} : job));
};

export const updateActiveJobStatus = (state : SchedulerState, action: PayloadAction<IProcessInstance>) => {
    state.activeJobs = state.activeJobs.map((process) => (process.id === action.payload.id ? {
        ...process,
        status: action.payload.status,
    } : process));
};
