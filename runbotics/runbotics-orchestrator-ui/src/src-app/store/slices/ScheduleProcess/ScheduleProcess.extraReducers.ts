import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import objFromArray from '#src-app/utils/objFromArray';

import { ScheduleProcessState } from './ScheduleProcess.state';
import {
    getScheduledProcesses, getSchedulesByProcess, scheduleProcess,
} from './ScheduleProcess.thunks';

const buildScheduleProcessExtraReducers = (builder: ActionReducerMapBuilder<ScheduleProcessState>) => {
    builder
        // GET SCHEDULED PROCESS
        .addCase(getScheduledProcesses.pending, (state) => {
            state.loading = true;
        })
        .addCase(getScheduledProcesses.fulfilled, (state, action) => {
            state.byId = objFromArray(action.payload);
            state.allIds = Object.keys(state.byId);
            state.loading = false;
        })
        .addCase(scheduleProcess.fulfilled, (state, action) => {
            state.byId[action.payload.id] = action.payload;
            state.allIds = Object.keys(state.byId);
            state.loading = false;
        })

        // GET SCHEDULES BY PROCESS
        .addCase(getSchedulesByProcess.pending, (state) => {
            state.loading = true;
        })
        .addCase(getSchedulesByProcess.fulfilled, (state, action) => {
            state.loading = false;
            state.schedules = action.payload;
            // state.byProcessId[action.meta.arg.processId] = action.payload;
        })
        .addCase(getSchedulesByProcess.rejected, (state) => {
            state.loading = false;
        });
};

export default buildScheduleProcessExtraReducers;
