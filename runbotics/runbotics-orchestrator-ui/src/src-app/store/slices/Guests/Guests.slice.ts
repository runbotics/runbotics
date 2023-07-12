import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import { buildGuestsExtraReducers } from './Guests.extraReducers';
import * as reducers from './Guests.reducers';
import { GuestsState } from './Guests.state';

import * as guestsThanks from './Guests.thunks';

export const EXECUTION_LIMIT = 10;

const initialState: GuestsState = {
    executionsCount: 0,
    remainingSessionTime: 0,
};

const slice = createSlice({
    name: 'guests',
    initialState,
    reducers,
    extraReducers: buildGuestsExtraReducers,
});

export const guestsSelector = (state: RootState) => state.guests;

export const guestsReducer = slice.reducer;

export const guestsActions = {
    ...slice.actions,
    ...guestsThanks,
};
