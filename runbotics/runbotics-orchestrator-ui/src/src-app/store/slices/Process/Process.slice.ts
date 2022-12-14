import { createSlice } from '@reduxjs/toolkit';
import { defaultProcessValue } from 'runbotics-common';


import { RootState } from '#src-app/store';

import LoadingType from '#src-app/types/loading';

import buildProcessExtraReducers from './Process.extraReducers';
import * as reducers from './Process.reducers';
import { ProcessState } from './Process.state';
import * as processThunks from './Process.thunks';


export const initialModelerState = {
    appliedActivities: [],
    isSaveDisabled: true,
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
