import { createSlice } from '@reduxjs/toolkit';

import buildActivityExtraReducers from './Activity.extraReducers';
import { ActivityState } from './Activity.state';
import * as activityThunks from './Activity.thunks';
import { RootState } from '../../index';

const initialState: ActivityState = {
    byId: {},
    allIds: [],
    loading: false,
};

export const slice = createSlice({
    name: 'activity',
    initialState,
    reducers: {},
    extraReducers: buildActivityExtraReducers,
});

export const activitySelector = (state: RootState) => state.activity;

export const activityReducer = slice.reducer;

export const activityActions = {
    ...slice.actions,
    ...activityThunks,
};
