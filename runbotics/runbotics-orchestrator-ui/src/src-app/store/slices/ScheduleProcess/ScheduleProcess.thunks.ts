import { createAsyncThunk } from '@reduxjs/toolkit';

import { IScheduleProcess } from '#src-app/types/model/schedule-process.model';
import axios from '#src-app/utils/axios';

export const scheduleProcess = createAsyncThunk<IScheduleProcess, IScheduleProcess>(
    'scheduleProcess/scheduleProcess',
    (payload) => axios.post<IScheduleProcess>('/scheduler/schedule-processes', payload)
        .then((response) => response.data),
);

export const getScheduledProcesses = createAsyncThunk<IScheduleProcess[]>(
    'scheduleProcess/getScheduledProcesses',
    () => axios.get<IScheduleProcess[]>('/api/schedule-processes')
        .then((response) => response.data),
);

export const getSchedulesByProcess = createAsyncThunk<IScheduleProcess[], { processId: number }>(
    'scheduleProcess/getSchedulesByProcess',
    ({ processId }) => axios.get<IScheduleProcess[]>(`/api/schedule-processes?processId.equals=${processId}`)
        .then((response) => response.data),
);

export const removeScheduledProcess = createAsyncThunk<void, { scheduleProcessId: number }>(
    'scheduleProcess/removeScheduledProcess',
    ({ scheduleProcessId }) => axios.delete(`/scheduler/schedule-processes/${scheduleProcessId}`),
);
