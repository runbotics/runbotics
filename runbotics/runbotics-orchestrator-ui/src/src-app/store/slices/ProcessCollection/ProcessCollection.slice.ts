import { createSlice } from '@reduxjs/toolkit';

import buildProcessCollectionExtraReducers from './ProcessCollection.extraReducers';
import { ProcessCollectionState } from './ProcessCollection.state';
import processCollectionThunks from './ProcessCollection.thunks';
import { RootState } from '../../index';

const initialState: ProcessCollectionState = {
    current: null,
    childrenProcesses: {
        isLoading: false,
        list: [],
        byPage: null,
    },
    active: {
        isLoading: false,
        childrenCollections: [],
        ancestors: []
    },
    allUserAccessible: {
        isLoading: false,
        list: [],
    },
};

export const slice = createSlice({
    name: 'processCollection',
    initialState,
    reducers: {},
    extraReducers: buildProcessCollectionExtraReducers,
});

export const processCollectionReducer = slice.reducer;

export const processCollectionSelector = (state: RootState) => state.processCollection;

export const processCollectionActions = {
    ...slice.actions,
    ...processCollectionThunks,
};
