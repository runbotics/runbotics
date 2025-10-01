import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AIAssistantsState } from './AIAssistants.state';
import { fetchAIAssistants } from './AIAssistants.thunks';

export const aiAssistantsExtraReducers = (builder: ActionReducerMapBuilder<AIAssistantsState>) => {
    builder
        .addCase(fetchAIAssistants.pending, (state) => {
            state.all.loading = true;
            state.all.error = null;
        })
        .addCase(fetchAIAssistants.fulfilled, (state, action) => {
            state.all.loading = false;
            state.all.assistants = action.payload;
            state.all.error = null;
        })
        .addCase(fetchAIAssistants.rejected, (state, action) => {
            state.all.loading = false;
            state.all.error = action.error.message || 'Failed to load AI Assistants';
        });
};
