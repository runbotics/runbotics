import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AIAssistantsState } from './AIAssistants.state';
import { fetchAIAssistants } from './AIAssistants.thunks';

export const aiAssistantsExtraReducers = (builder: ActionReducerMapBuilder<AIAssistantsState>) => {
    builder
        .addCase(fetchAIAssistants.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAIAssistants.fulfilled, (state, action) => {
            state.loading = false;
            state.assistants = action.payload;
            state.error = null;
        })
        .addCase(fetchAIAssistants.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to load AI Assistants';
        });
};
