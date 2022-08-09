import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { getAll } from './BotSystems.thunks';
import { BotSystemsState } from './BotSystemsState';

const buildBotSystemsExtraReducers = (builder: ActionReducerMapBuilder<BotSystemsState>) => {
    builder
        // GET ALL
        .addCase(getAll.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            state.loading = false;
            state.botSystems = action.payload;
        })
        .addCase(getAll.rejected, (state) => {
            state.loading = false;
        });
};

export default buildBotSystemsExtraReducers;