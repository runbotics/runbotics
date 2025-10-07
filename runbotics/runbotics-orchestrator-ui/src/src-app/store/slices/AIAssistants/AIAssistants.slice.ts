import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import { aiAssistantsExtraReducers } from './AIAssistants.extraReducers';
import { initialState } from './AIAssistants.state';
import * as aiAssistantsThunks from './AIAssistants.thunks';

export const aiAssistantsSlice = createSlice({
    name: 'aiAssistants',
    initialState,
    reducers: {},
    extraReducers: aiAssistantsExtraReducers,
});

export const aiAssistantsReducer = aiAssistantsSlice.reducer;

export const aiAssistantsSelector = (state: RootState) => state.aiAssistants;

export const aiAssistantsActions = {
    ...aiAssistantsSlice.actions,
    ...aiAssistantsThunks,
};
