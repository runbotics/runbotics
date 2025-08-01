import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import buildProcessSubscriptionStatisticsExtraReducers from './ProcessSubscriptionStatistics.extraReducers';
import { ProcessSubscriptionStatisticsState } from './ProcessSubscriptionStatistics.state';
import * as ProcessSubscriptionStatisticsThunks from './ProcessSubscriptionStatistics.thunks';

export const initialState: ProcessSubscriptionStatisticsState = {
    subscriptions: [],
    loading: false,
};

export const slice = createSlice({
    name: 'processSubscriptionStatistics',
    initialState,
    reducers: {},
    extraReducers: buildProcessSubscriptionStatisticsExtraReducers,
});

export const processSubscriptionStatisticsReducer = slice.reducer;

export const processSubscriptionStatisticsSelector = (state: RootState) => state.processSubscriptionStatistics;
export const subscribersSelector = (state: RootState) => state.processSubscriptionStatistics.subscriptions;

export const ProcessSubscriptionStatisticsActions = {
    ...slice.actions,
    ...ProcessSubscriptionStatisticsThunks,
};
