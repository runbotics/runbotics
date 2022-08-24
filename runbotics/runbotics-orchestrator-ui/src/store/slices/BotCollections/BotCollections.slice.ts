import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../index';
import * as botCollectionThunks from './BotCollections.thunks';
import { BotCollectionsState } from './BotCollections.state';
import buildBotCollectionExtraReducers from './BotCollections.extraReducers';

const initialState: BotCollectionsState = {
    loading: false,
    botCollections: [],
    byPage: null,
};

export const slice = createSlice({
    name: 'botCollection',
    initialState,
    reducers: {},
    extraReducers: buildBotCollectionExtraReducers,
});

export const botCollectionReducer = slice.reducer;

export const botCollectionSelector = (state: RootState) => state.botCollection;

export const botCollectionActions = {
    ...slice.actions,
    ...botCollectionThunks,
};
