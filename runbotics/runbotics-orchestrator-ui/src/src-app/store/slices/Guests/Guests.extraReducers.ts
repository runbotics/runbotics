import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { GuestsState } from './Guests.state';
import { getCurrentGuest } from './Guests.thunks';

export const buildGuestsExtraReducers = (builder: ActionReducerMapBuilder<GuestsState>) => {
    builder
        .addCase(getCurrentGuest.fulfilled, (state, { payload }) => {
            state.executionsCount = payload.executionsCount;
        })
        .addCase(getCurrentGuest.rejected, (state) => {
            state.executionsCount = 0;
        });
};
