import { ActionReducerMapBuilder } from '@reduxjs/toolkit';


import { ROOT_PROCESS_COLLECTION_ID } from 'runbotics-common';

import { ProcessCollectionState } from './ProcessCollection.state';
import { getAllWithAncestors, createOne, getAllAccessible, updateOne, deleteOne } from './ProcessCollection.thunks';

const buildProcessCollectionExtraReducers = (builder: ActionReducerMapBuilder<ProcessCollectionState>) => {
    builder
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

        .addCase(createOne.pending, (state) => {
            state.active.isLoading = true;
        })
        .addCase(createOne.fulfilled, (state, action) => {
            state.active.isLoading = false;
            const activeCollectionId = action.meta.arg.parentId || ROOT_PROCESS_COLLECTION_ID;
            const newCollection = action.payload;
            if (newCollection.parentId === activeCollectionId) state.active.childrenCollections = [...state.active.childrenCollections, newCollection];
        })
        .addCase(createOne.rejected, (state) => {
            state.active.isLoading = false;
        })

        .addCase(updateOne.pending, (state) => {
            state.active.isLoading = true;
        })
        .addCase(updateOne.fulfilled, (state, action) => {
            state.active.isLoading = false;
            const activeCollectionId = action.meta.arg.parentId || ROOT_PROCESS_COLLECTION_ID;
            const updatedCollection = action.payload;
            const isUpdatedInsideActiveCollection = updatedCollection.parentId === activeCollectionId;
            if (!isUpdatedInsideActiveCollection) state.active.childrenCollections = state.active.childrenCollections.filter((collection) => collection.id !== updatedCollection.id);
            state.active.childrenCollections = state.active.childrenCollections.map((collection) => {
                if (collection.id === updatedCollection.id) return updatedCollection;
                return collection;
            });
        })
        .addCase(updateOne.rejected, (state) => {
            state.active.isLoading = false;
        })

        .addCase(getAllAccessible.pending, (state) => {
            state.allUserAccessible.isLoading = true;
        })
        .addCase(getAllAccessible.fulfilled, (state, action) => {
            state.allUserAccessible.isLoading = false;
            state.allUserAccessible.list = [...action.payload];
        })
        .addCase(getAllAccessible.rejected, (state, _action) => {
            state.allUserAccessible.isLoading = false;
            state.allUserAccessible.list = [];
        })

        .addCase(deleteOne.pending, (state) => {
            state.active.isLoading = true;
        })
        .addCase(deleteOne.fulfilled, (state, action) => {
            state.active.isLoading = false;
            const deletedCollectionId = action.meta.arg.id;
            state.active.childrenCollections = state.active.childrenCollections.filter((collection) => collection.id !== deletedCollectionId);
        })
        .addCase(deleteOne.rejected, (state) => {
            state.active.isLoading = false;
        });
};

export default buildProcessCollectionExtraReducers;
