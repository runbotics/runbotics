import { createSlice } from '@reduxjs/toolkit';

import buildScheduledJobsExtraReducers from './Scheduler.extraReducers';
import * as reducers from './Scheduler.reducers';
import * as scheduledJobsThunks from './Scheduler.thunks';
import { RootState } from '../../index';

const initialState = {
    loading: false,
    scheduledJobs: [],
    activeJobs: [],
    waitingJobs: [],
};

export const slice = createSlice({
    name: 'scheduler',
    initialState,
    reducers,
    extraReducers: buildScheduledJobsExtraReducers,
});

export const schedulerSelector = (state: RootState) => state.scheduler;

export const schedulerReducer = slice.reducer;

export const schedulerActions = {
    ...slice.actions,
    ...scheduledJobsThunks,
};
