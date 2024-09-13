import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ScheduleProcessState } from './ScheduleProcess.state';
import {
    getSchedulesByProcess,
} from './ScheduleProcess.thunks';

const buildScheduleProcessExtraReducers = (builder: ActionReducerMapBuilder<ScheduleProcessState>) => {
    builder
        // GET SCHEDULES BY PROCESS
        .addCase(getSchedulesByProcess.pending, (state) => {
            state.loading = true;
        })
        .addCase(getSchedulesByProcess.fulfilled, (state, action) => {
            state.loading = false;
            state.schedules = action.payload;
        })
        .addCase(getSchedulesByProcess.rejected, (state) => {
            state.loading = false;
        });
};

export default buildScheduleProcessExtraReducers;
