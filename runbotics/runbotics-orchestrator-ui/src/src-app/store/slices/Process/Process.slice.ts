import { createSlice } from '@reduxjs/toolkit';
import { defaultProcessValue } from 'runbotics-common';

import { RootState } from '#src-app/store';
import LoadingType from '#src-app/types/loading';

import buildProcessExtraReducers from './Process.extraReducers';
import * as reducers from './Process.reducers';
import { ModelerState, ProcessState } from './Process.state';
import * as processThunks from './Process.thunks';

export const initialModelerState: ModelerState = {
    currentProcessOutputElement: null,
    selectedElement: null,
    selectedAction: null,
    isSaveDisabled: true,
    errors: [],
    customValidationErrors: [],
    appliedActivities: [],
    options: null,
    variables: [],
    commandStack: {
        commandStackSize: 0,
        commandStackIdx: -1,
    },
    passedInVariables: [],
    imported: false,
    activeDrag: false
};

export const initialState: ProcessState = {
    draft: {
        loading: LoadingType.IDLE,
        process: defaultProcessValue,
        currentRequestId: undefined,
        error: null,
        processSubscriptions: [],
        credentials: [],
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
export const currentProcessSelector = (state: RootState) =>
    state.process.draft.process;

export const processActions = {
    ...slice.actions,
    ...processThunks,
};
