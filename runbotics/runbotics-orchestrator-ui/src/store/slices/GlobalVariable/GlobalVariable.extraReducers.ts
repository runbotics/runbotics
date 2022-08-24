import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { GlobalVariableState } from './GlobalVariable.state';
import {
    createGlobalVariable,
    deleteGlobalVariable,
    getGlobalVariables,
    updateGlobalVariable,
} from './GlobalVariable.thunks';

const buildGlobalVariablesExtraReducers = (builder: ActionReducerMapBuilder<GlobalVariableState>) => {
    builder
        // GET
        .addCase(getGlobalVariables.pending, (state) => {
            state.loading = true;
        })
        .addCase(getGlobalVariables.fulfilled, (state, action) => {
            state.globalVariables = action.payload;
            state.loading = false;
        })
        .addCase(getGlobalVariables.rejected, (state) => {
            state.loading = false;
        })

        // CREATE
        .addCase(createGlobalVariable.pending, (state) => {
            state.loading = true;
        })
        .addCase(createGlobalVariable.fulfilled, (state, action) => {
            state.globalVariables = [...state.globalVariables, action.payload];
            state.loading = false;
        })
        .addCase(createGlobalVariable.rejected, (state) => {
            state.loading = false;
        })

        // UPDATE
        .addCase(updateGlobalVariable.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateGlobalVariable.fulfilled, (state, action) => {
            const filteredVariables = state.globalVariables.filter((variable) => variable.id !== action.payload.id);
            state.globalVariables = [...filteredVariables, action.payload];
            state.loading = false;
        })
        .addCase(updateGlobalVariable.rejected, (state) => {
            state.loading = false;
        })

        // DELETE
        .addCase(deleteGlobalVariable.fulfilled, (state, action) => {
            state.globalVariables = state.globalVariables.filter((variable) => variable.id !== action.meta.arg.id);
        });
};

export default buildGlobalVariablesExtraReducers;
