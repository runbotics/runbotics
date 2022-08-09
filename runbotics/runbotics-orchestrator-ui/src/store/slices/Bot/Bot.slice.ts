import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/store';
import buildBotExtraReducers from './Bot.extraReducers';
import { BotState } from './Bot.state';
import * as botThunks from './Bot.thunks';
import * as reducers from './Bot.reducers';

const initialState: BotState = {
    bots: {
        loading: false,
        byId: {},
        allIds: [],
        page: null,
    },
};

export const slice = createSlice({
    name: 'bot',
    initialState,
    reducers,
    extraReducers: buildBotExtraReducers,
});

export const botSelector = (state: RootState) => state.bot;

export const botReducer = slice.reducer;

export const botActions = {
    ...slice.actions,
    ...botThunks,
};
