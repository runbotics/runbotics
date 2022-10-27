import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { IBot } from 'runbotics-common';

import { BotState } from './Bot.state';
import {
    deleteById, getAll, getPage, getById,
} from './Bot.thunks';

const buildBotExtraReducers = (builder: ActionReducerMapBuilder<BotState>) => {
    builder
        // GET BY ID
        .addCase(getById.pending, (state) => {
            state.bots.loading = true;
        })
        .addCase(getById.fulfilled, (state, action) => {
            state.bots.loading = false;
            state.bots.byId[action.payload.id] = action.payload;
            state.bots.allIds = Array.from(new Set([...state.bots.allIds, action.payload.id.toString()]));
        })
        .addCase(getById.rejected, (state) => {
            state.bots.loading = false;
        })

        // GET ALL
        .addCase(getAll.pending, (state) => {
            state.bots.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            state.bots.loading = false;
            state.bots.byId = action.payload.reduce<Record<string, IBot>>((accumulator, current) => {
                accumulator[current.id] = current;
                return accumulator;
            }, {});
            state.bots.allIds = Object.keys(state.bots.byId);
        })
        .addCase(getAll.rejected, (state) => {
            state.bots.loading = false;
        })

        // GET PAGE
        .addCase(getPage.pending, (state) => {
            state.bots.loading = true;
        })
        .addCase(getPage.fulfilled, (state, action) => {
            state.bots.page = action.payload;
            state.bots.loading = false;
        })
        .addCase(getPage.rejected, (state) => {
            state.bots.loading = false;
        })

        // DELETE
        .addCase(deleteById.pending, (state) => {
            state.bots.loading = true;
        })
        .addCase(deleteById.fulfilled, (state, action) => {
            state.bots.loading = false;
            delete state.bots.byId[action.meta.arg.id];
        })
        .addCase(deleteById.rejected, (state) => {
            state.bots.loading = false;
        });
};

export default buildBotExtraReducers;
