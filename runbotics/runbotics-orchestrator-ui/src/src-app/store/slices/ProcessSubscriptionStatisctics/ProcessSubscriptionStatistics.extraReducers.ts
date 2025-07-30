import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ProcessSubscriptionStatisticsState } from './ProcessSubscriptionStatistics.state';
import { fetchSubscribers, createSubscriber, deleteSubscriber, updateSubscriber, fetchSubscribersByProcessId } from './ProcessSubscriptionStatistics.thunks';

const buildProcessSubscriptionStatisticsExtraReducers = (
    builder: ActionReducerMapBuilder<ProcessSubscriptionStatisticsState>
) => {
    builder
        // FETCH SUBSCRIBERS (GET ALL)
        .addCase(fetchSubscribers.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchSubscribers.fulfilled, (state, action) => {
            state.loading = false;
            state.subscriptions = action.payload;
        })
        .addCase(fetchSubscribers.rejected, (state) => {
            state.loading = false;
        })

        // FETCH SUBSCRIBERS BY PROCESS ID
        .addCase(fetchSubscribersByProcessId.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchSubscribersByProcessId.fulfilled, (state, action) => {
            state.loading = false;
            state.subscriptions = action.payload;
        })
        .addCase(fetchSubscribersByProcessId.rejected, (state) => {
            state.loading = false;
        })

        // ADD SUBSCRIBER
        .addCase(createSubscriber.pending, (state) => {
            state.loading = true;
        })
        .addCase(createSubscriber.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(createSubscriber.rejected, (state) => {
            state.loading = false;
        })

        // REMOVE SUBSCRIBER
        .addCase(deleteSubscriber.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteSubscriber.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteSubscriber.rejected, (state) => {
            state.loading = false;
        })

        // UPDATE SUBSCRIBER
        .addCase(updateSubscriber.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateSubscriber.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(updateSubscriber.rejected, (state) => {
            state.loading = false;
        });
};

export default buildProcessSubscriptionStatisticsExtraReducers;
