import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { SchedulerState } from './Scheduler.state';
import {
    getScheduledJobs, getActiveJobs, getWaitingJobs, removeWaitingJob,
} from './Scheduler.thunks';

const buildScheduledJobsExtraReducers = (builder: ActionReducerMapBuilder<SchedulerState>) => {
    builder
        // GET SCHEDULED JOBS
        .addCase(getScheduledJobs.pending, (state) => {
            state.loading = true;
        })
        .addCase(getScheduledJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduledJobs = action.payload;
        })
        .addCase(getScheduledJobs.rejected, (state) => {
            state.loading = false;
        })

        // GET ACTIVE JOBS
        .addCase(getActiveJobs.pending, (state) => {
            state.loading = true;
        })
        .addCase(getActiveJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.activeJobs = action.payload;
        })
        .addCase(getActiveJobs.rejected, (state) => {
            state.loading = false;
        })

        // GET WAITING JOBS
        .addCase(getWaitingJobs.pending, (state) => {
            state.loading = true;
        })
        .addCase(getWaitingJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.waitingJobs = action.payload;
        })
        .addCase(getWaitingJobs.rejected, (state) => {
            state.loading = false;
        })

        // Delete Waiting Job
        .addCase(removeWaitingJob.pending, (state) => {
            state.loading = true;
        })
        .addCase(removeWaitingJob.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(removeWaitingJob.rejected, (state) => {
            state.loading = false;
        });
};

export default buildScheduledJobsExtraReducers;
