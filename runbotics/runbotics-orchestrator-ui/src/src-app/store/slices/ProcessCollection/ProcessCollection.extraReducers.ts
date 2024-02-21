import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ProcessCollectionState } from './ProcessCollection.state';
import { createOne, getAllAccessible } from './ProcessCollection.thunks';

const buildProcessCollectionExtraReducers = (builder: ActionReducerMapBuilder<ProcessCollectionState>) => {
    builder
        // POST one
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
        // GET user accessible
        .addCase(getAllAccessible.pending, (state) => {
            state.allUserAccessible.isLoading = true;
        })
        .addCase(getAllAccessible.fulfilled, (state, action) => {
            state.allUserAccessible.isLoading = false;
            state.allUserAccessible.list = [...action.payload];
        })
        .addCase(getAllAccessible.rejected, (state, action) => {
            state.allUserAccessible.isLoading = false;
            state.allUserAccessible.list = [];
        });
};

export default buildProcessCollectionExtraReducers;
