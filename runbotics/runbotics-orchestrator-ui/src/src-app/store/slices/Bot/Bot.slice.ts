import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import buildBotExtraReducers from './Bot.extraReducers';
import * as reducers from './Bot.reducers';
import { BotState } from './Bot.state';
import * as botThunks from './Bot.thunks';

const initialState: BotState = {
    bots: {
        loading: false,
        byId: {},
        allIds: [],
        page: null,
        botSubscriptions: [],
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
