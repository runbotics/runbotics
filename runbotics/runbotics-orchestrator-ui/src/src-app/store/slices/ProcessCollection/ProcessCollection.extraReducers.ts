import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ProcessCollectionState } from './ProcessCollection.state';
import { createOne } from './ProcessCollection.thunks';

const buildProcessCollectionExtraReducers = (builder: ActionReducerMapBuilder<ProcessCollectionState>) => {
    builder
        // CREATE ONE
        .addCase(createOne.pending, (state) => {
            state.childrenCollections.isLoading = true;
        })
        .addCase(createOne.fulfilled, (state, action) => {
            state.childrenCollections.isLoading = false;
            const newCollection = action.payload;
            state.childrenCollections.list = [...state.childrenCollections.list, newCollection];
        })
        .addCase(createOne.rejected, (state) => {
            state.childrenCollections.isLoading = false;
        });
};

export default buildProcessCollectionExtraReducers;
