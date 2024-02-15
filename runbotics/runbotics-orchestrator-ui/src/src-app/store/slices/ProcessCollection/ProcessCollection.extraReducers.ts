import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ProcessCollectionState } from './ProcessCollection.state';
import { createOne, getAncestors } from './ProcessCollection.thunks';

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
        })

        // GET PATH
        .addCase(getAncestors.pending, (state) => {
            state.active.ancestors.isLoading = true;
        })
        .addCase(getAncestors.fulfilled, (state, action) => {
            state.active.ancestors.list = [...action.payload];
            state.active.ancestors.isLoading = false;
        })
        .addCase(getAncestors.rejected, (state) => {
            state.active.ancestors.isLoading = false;
            state.active.ancestors.list = [];
        });
};

export default buildProcessCollectionExtraReducers;
