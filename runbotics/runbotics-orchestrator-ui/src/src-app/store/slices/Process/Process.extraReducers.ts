import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import LoadingType from '#src-app/types/loading';
import objFromArray from '#src-app/utils/objFromArray';

import { ProcessState } from './Process.state';
import {
    fetchProcessById,
    getProcesses,
    updateDiagram,
    setDraft,
    deleteProcess,
    getProcessesPage,
    partialUpdateProcess,
    createGuestProcess,
    subscribeProcessNotifications,
    unsubscribeProcessNotifications,
    getProcessSubscriptionInfo,
    getProcessesPageByCollection,
    getProcessCredentials,
} from './Process.thunks';

// eslint-disable-next-line max-lines-per-function
const buildProcessExtraReducers = (builder: ActionReducerMapBuilder<ProcessState>) => {
    builder
        // GET ALL
        .addCase(getProcesses.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getProcesses.fulfilled, (state, action) => {
            state.all.loading = false;
            state.all.byId = objFromArray(action.payload);
            state.all.ids = Object.keys(state.all.byId);
        })
        .addCase(getProcesses.rejected, (state) => {
            state.all.loading = false;
        })

        // GET PAGE
        .addCase(getProcessesPage.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getProcessesPage.fulfilled, (state, action) => {
            state.all.page = action.payload;
            state.all.loading = false;
        })
        .addCase(getProcessesPage.rejected, (state) => {
            state.all.loading = false;
        })

        // GET PAGE BY COLLECTIONS
        .addCase(getProcessesPageByCollection.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getProcessesPageByCollection.fulfilled, (state, action) => {
            state.all.page = action.payload;
            state.all.loading = false;
        })
        .addCase(getProcessesPageByCollection.rejected, (state) => {
            state.all.loading = false;
        })

        // UPDATE
        .addCase(updateDiagram.pending, (state, action) => {
            state.draft.loading = LoadingType.PENDING;
            state.draft.currentRequestId = action.meta.requestId;
        })
        .addCase(updateDiagram.fulfilled, (state, action) => {
            state.draft.process = action.payload;
            state.draft.loading = LoadingType.IDLE;
        })
        .addCase(updateDiagram.rejected, (state, action) => {
            state.draft.loading = LoadingType.IDLE;
            if (action.payload) { state.draft.error = action.payload; }
            else { state.draft.error = action.error.message; }

        })

        .addCase(setDraft.fulfilled, (state, { payload }) => {
            state.draft.process = payload;
            state.draft.loading = LoadingType.IDLE;
        })

        // GET BY ID
        .addCase(fetchProcessById.pending, (state, action) => {
            state.draft.loading = LoadingType.PENDING;
            state.draft.currentRequestId = action.meta.requestId;
        })
        .addCase(fetchProcessById.fulfilled, (state, { payload }) => {
            state.draft.process = payload;
            state.draft.loading = LoadingType.IDLE;
        })
        .addCase(fetchProcessById.rejected, (state, action) => {
            state.draft.loading = LoadingType.IDLE;
            if (action.payload) { state.draft.error = action.payload; }
            else { state.draft.error = action.error.message; }
        })

        // CREATE GUEST PROCESS
        .addCase(createGuestProcess.pending, (state) => {
            state.draft.loading = LoadingType.PENDING;
        })
        .addCase(createGuestProcess.fulfilled, (state, action) => {
            state.draft.process = action.payload;
            state.draft.loading = LoadingType.IDLE;
        })
        .addCase(createGuestProcess.rejected, (state) => {
            state.draft.loading = LoadingType.IDLE;
        })

        // DELETE
        .addCase(deleteProcess.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(deleteProcess.fulfilled, (state, action) => {
            state.all.loading = false;
            delete state.all.byId[action.meta.arg.resourceId];
        })
        .addCase(deleteProcess.rejected, (state) => {
            state.all.loading = false;
        })

        // PARTIAL UPDATE
        .addCase(partialUpdateProcess.fulfilled, (state, action) => {
            state.draft.process = action.payload;
        })
        .addCase(partialUpdateProcess.rejected, (state, action: any) => {
            state.draft.error = action.payload.status;
        })

        // SUBSCRIBE PROCESS NOTIFICATIONS
        .addCase(subscribeProcessNotifications.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(subscribeProcessNotifications.fulfilled, (state) => {
            state.all.loading = false;
        })
        .addCase(subscribeProcessNotifications.rejected, (state) => {
            state.all.loading = false;
        })

        // UNSUBSCRIBE PROCESS NOTIFICATIONS
        .addCase(unsubscribeProcessNotifications.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(unsubscribeProcessNotifications.fulfilled, (state) => {
            state.all.loading = false;
        })
        .addCase(unsubscribeProcessNotifications.rejected, (state) => {
            state.all.loading = false;
        })

        // GET ALL PROCESS SUBSCRIPTIONS
        .addCase(getProcessSubscriptionInfo.pending, (state) => {
            state.all.loading = true;
        })
        .addCase(getProcessSubscriptionInfo.fulfilled, (state, action) => {
            state.all.loading = false;
            state.draft.processSubscriptions = action.payload;
        })
        .addCase(getProcessSubscriptionInfo.rejected, (state) => {
            state.all.loading = false;
        })

        // GET ALL PROCESS CREDENTIALS
        .addCase(getProcessCredentials.fulfilled, (state, action) => {
            state.draft.credentials = action.payload;
        });
};

export default buildProcessExtraReducers;
