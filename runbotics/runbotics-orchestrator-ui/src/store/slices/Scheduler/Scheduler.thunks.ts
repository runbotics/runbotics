import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IProcessInstance, ProcessInstanceStatus } from 'runbotics-common';

import { ScheduledJob, SchedulerJob } from './Scheduler.state';

const processStatuses = [ProcessInstanceStatus.IN_PROGRESS, ProcessInstanceStatus.INITIALIZING];

export const getScheduledJobs = createAsyncThunk<ScheduledJob[]>(
    'scheduledJobs/getScheduledJobs',
    () => axios.get('/scheduler/scheduled-jobs')
        .then((response) => response.data),
);

export const getActiveJobs = createAsyncThunk<IProcessInstance[]>(
    'scheduledJobs/getActiveJobs',
    () => axios.get(`/api/process-instances?status=${processStatuses.toString()}`)
        .then((response) => response.data),
);

export const getWaitingJobs = createAsyncThunk<SchedulerJob[]>(
    'scheduledJobs/getWaitingJobs',
    () => axios.get('/scheduler/jobs/waiting')
        .then((response) => response.data),
);

export const removeWaitingJob = createAsyncThunk<void, { jobId: string }>(
    'scheduledJobs/removeWaitingJob',
    ({ jobId }) => axios.delete(`/scheduler/jobs/${jobId}`),
);

export const terminateActiveJob = createAsyncThunk<void, { jobId: string }>(
    'activeJobs/terminateActiveJob',
    ({ jobId }) => axios.post(`scheduler/process-instances/${jobId}/terminate`)
        .then((response) => response.data),
);
