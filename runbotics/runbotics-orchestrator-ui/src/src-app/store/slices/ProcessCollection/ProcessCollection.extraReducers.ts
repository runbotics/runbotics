import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ProcessCollectionState } from './ProcessCollection.state';
import { getAllWithAncestors, createOne } from './ProcessCollection.thunks';

const buildProcessCollectionExtraReducers = (builder: ActionReducerMapBuilder<ProcessCollectionState>) => {
    builder
        // GET ALL WITH ANCESTORS
        .addCase(getAllWithAncestors.pending, (state) => {
            state.active.isLoading = true;
        })
        .addCase(getAllWithAncestors.fulfilled, (state, action) => {
            state.active.ancestors = [...action.payload.breadcrumbs];
            state.active.childrenCollections = [...action.payload.childrenCollections];
            state.active.isLoading = false;
        })
        .addCase(getAllWithAncestors.rejected, (state) => {
            state.active.ancestors = [];
            state.active.childrenCollections = [];
            state.active.isLoading = false;
        })

        // CREATE ONE
        .addCase(createOne.pending, (state) => {
            state.active.isLoading = true;
        })
        .addCase(createOne.fulfilled, (state, action) => {
            const newCollection = action.payload;
            state.active.childrenCollections = [...state.active.childrenCollections, newCollection];
            state.active.isLoading = false;
        })
        .addCase(createOne.rejected, (state) => {
            state.active.isLoading = false;
        });
};

export default buildProcessCollectionExtraReducers;
