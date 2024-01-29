import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ProcessOutputState } from './ProcessOutput.state';
import { getAll } from './ProcessOutput.thunks';

const buildProcessOutputExtraReducers = (builder: ActionReducerMapBuilder<ProcessOutputState>) => {
    builder
        // GET ALL PROCESS OUTPUT TYPES
        .addCase(getAll.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            state.loading = false;
            state.processOutputs = action.payload;
        })
        .addCase(getAll.rejected, (state) => {
            state.loading = false;
        });
};

export default buildProcessOutputExtraReducers;
