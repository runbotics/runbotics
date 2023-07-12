import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { GuestsState } from './Guests.state';
import { getGuestExecutionCount } from './Guests.thunks';

export const buildGuestsExtraReducers = (builder: ActionReducerMapBuilder<GuestsState>) => {
    builder
        .addCase(getGuestExecutionCount.fulfilled, (state, { payload }) => {
            state.executionsCount = payload.executionsCount;
        })
        .addCase(getGuestExecutionCount.rejected, (state) => {
            state.executionsCount = 0;
        });
};
