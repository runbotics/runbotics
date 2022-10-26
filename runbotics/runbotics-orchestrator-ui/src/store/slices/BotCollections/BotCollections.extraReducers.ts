import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { getAll, deleteOne, getByPage, updateOne, createOne } from './BotCollections.thunks';
import { BotCollectionsState } from './BotCollections.state';

const buildBotCollectionExtraReducers = (builder: ActionReducerMapBuilder<BotCollectionsState>) => {
    builder
        // GET ALL
        .addCase(getAll.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            state.loading = false;
            state.botCollections = action.payload;
        })
        .addCase(getAll.rejected, (state) => {
            state.loading = false;
        })
        // GET BY PAGE
        .addCase(getByPage.pending, (state) => {
            state.loading = true;
        })
        .addCase(getByPage.fulfilled, (state, action) => {
            state.loading = false;
            state.byPage = action.payload;
        })
        .addCase(getByPage.rejected, (state) => {
            state.loading = false;
        })
        // DELETE ONE
        .addCase(deleteOne.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteOne.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteOne.rejected, (state) => {
            state.loading = false;
        })
        // UPDATE ONE
        .addCase(updateOne.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateOne.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(updateOne.rejected, (state) => {
            state.loading = false;
        })
        // CREATE ONE
        .addCase(createOne.pending, (state) => {
            state.loading = true;
        })
        .addCase(createOne.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(createOne.rejected, (state) => {
            state.loading = false;
        });
};

export default buildBotCollectionExtraReducers;
