import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { ProcessInstanceEventState } from './ProcessInstanceEvent.state';
import { getProcessInstanceEvents } from './ProcessInstanceEvent.thunks';

const buildProcessInstanceEventExtraReducers = (builder: ActionReducerMapBuilder<ProcessInstanceEventState>) => {
    builder
        // GET
        .addCase(getProcessInstanceEvents.pending, (state) => {
            state.all.loading = true;
            state.all.events = [];
        })
        .addCase(getProcessInstanceEvents.fulfilled, (state, action) => {
            state.all.events = action.payload;
            state.all.loading = false;
        })
        .addCase(getProcessInstanceEvents.rejected, (state) => {
            state.all.loading = false;
        });
};

export default buildProcessInstanceEventExtraReducers;
