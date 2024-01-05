import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import buildProcessOutputExtraReducers from './ProcessOutput.extraReducers';
import { ProcessOutputState } from './ProcessOutput.state';
import * as processOutputThunks from './ProcessOutput.thunks';

const initialState: ProcessOutputState = {
    loading: false,
    processOutputs: []
};

export const slice = createSlice({
    name: 'processOutput',
    initialState,
    reducers: {},
    extraReducers: buildProcessOutputExtraReducers,
});

export const processOutputReducer = slice.reducer;

export const processOutputSelector = (state: RootState) => state.processOutput;

export const processOutputActions = {
    ...slice.actions,
    ...processOutputThunks,
};
