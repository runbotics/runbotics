import { createSlice } from '@reduxjs/toolkit';
import { defaultProcessValue } from 'runbotics-common';
import LoadingType from 'src/types/loading';
import { RootState } from 'src/store';
import buildProcessExtraReducers from './Process.extraReducers';
import { ProcessState } from './Process.state';
import * as processThunks from './Process.thunks';
import * as reducers from './Process.reducers';

export const initialModelerState = {
    appliedActivities: [],
    isDirty: false,
    commandStackSize: 0,
    commandStackIdx: -1,
};

export const initialState: ProcessState = {
    draft: {
        loading: LoadingType.IDLE,
        process: defaultProcessValue,
        currentRequestId: undefined,
        error: null,
    },
    modeler: initialModelerState,
    all: {
        loading: false,
        byId: {},
        ids: [],
        page: null,
    },
};


export const slice = createSlice({
    name: 'process',
    initialState,
    reducers,
    extraReducers: buildProcessExtraReducers,
});

export const processReducer = slice.reducer;

export const processSelector = (state: RootState) => state.process;
export const currentProcessSelector = (state: RootState) => state.process.draft.process;

export const processActions = {
    ...slice.actions,
    ...processThunks,
};
