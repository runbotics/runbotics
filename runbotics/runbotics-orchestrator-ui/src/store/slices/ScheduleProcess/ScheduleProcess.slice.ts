import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../index';
import buildScheduleProcessExtraReducers from './ScheduleProcess.extraReducers';
import { ScheduleProcessState } from './ScheduleProcess.state';
import * as scheduleProcessThunks from './ScheduleProcess.thunks';

const initialState: ScheduleProcessState = {
    loading: false,
    byId: {},
    allIds: [],
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
