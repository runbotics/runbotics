import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import objFromArray from '#src-app/utils/objFromArray';

import { ActivityState } from './Activity.state';
import { getActivities } from './Activity.thunks';

const buildActivityExtraReducers = (builder: ActionReducerMapBuilder<ActivityState>) => {
    builder
        // GET ALL
        .addCase(getActivities.pending, (state) => {
            state.loading = true;
        })
        .addCase(getActivities.fulfilled, (state, action) => {
            state.byId = objFromArray(action.payload, 'executionId');
            state.allIds = Object.keys(state.byId);
            state.loading = false;
        })
        .addCase(getActivities.rejected, (state) => {
            state.loading = false;
        });
};

export default buildActivityExtraReducers;
