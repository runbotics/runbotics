import { createSlice } from '@reduxjs/toolkit';

import buildScheduleProcessExtraReducers from './ScheduleProcess.extraReducers';
import { ScheduleProcessState } from './ScheduleProcess.state';
import * as scheduleProcessThunks from './ScheduleProcess.thunks';
import { RootState } from '../../index';

const initialState: ScheduleProcessState = {
    loading: false,
    schedules: [],
};

export const slice = createSlice({
    name: 'scheduledProcess',
    initialState,
    reducers: {},
    extraReducers: buildScheduleProcessExtraReducers,
});

export const scheduleProcessSelector = (state: RootState) => state.scheduleProcess;

export const scheduleProcessReducer = slice.reducer;

export const scheduleProcessActions = {
    ...slice.actions,
    ...scheduleProcessThunks,
};
