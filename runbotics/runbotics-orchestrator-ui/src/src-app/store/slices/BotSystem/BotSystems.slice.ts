import { createSlice } from '@reduxjs/toolkit';

import buildBotSystemsExtraReducers from './BotSystems.extraReducers';
import * as botSystemsThunks from './BotSystems.thunks';
import { BotSystemsState } from './BotSystemsState';
import { RootState } from '../../index';

const initialState: BotSystemsState = {
    loading: false,
    botSystems: [],
};

export const slice = createSlice({
    name: 'botSystem',
    initialState,
    reducers: {},
    extraReducers: buildBotSystemsExtraReducers,
});

export const botSystemsReducer = slice.reducer;

export const botSystemsSelector = (state: RootState) => state.botSystem;

export const botSystemsActions = {
    ...slice.actions,
    ...botSystemsThunks,
};
