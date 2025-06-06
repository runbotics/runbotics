import { createSlice } from '@reduxjs/toolkit';

import { CollectionsDisplayMode } from '#src-app/views/bot/BotBrowseView/BotBrowseView.utils';

import buildBotCollectionExtraReducers from './BotCollections.extraReducers';
import * as reducers from './BotCollections.reducers';
import { BotCollectionsState } from './BotCollections.state';
import * as botCollectionThunks from './BotCollections.thunks';
import { RootState } from '../../index';

const initialState: BotCollectionsState = {
    loading: false,
    botCollections: [],
    byPage: null,
    displayMode: CollectionsDisplayMode.GRID
};

export const slice = createSlice({
    name: 'botCollection',
    initialState,
    reducers,
    extraReducers: buildBotCollectionExtraReducers,
});

export const botCollectionReducer = slice.reducer;

export const botCollectionSelector = (state: RootState) => state.botCollection;

export const botCollectionActions = {
    ...slice.actions,
    ...botCollectionThunks,
};
