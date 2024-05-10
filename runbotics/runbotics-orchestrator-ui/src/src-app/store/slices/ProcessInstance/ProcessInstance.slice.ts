import { createSlice } from '@reduxjs/toolkit';

import buildProcessInstanceExtraReducers from './ProcessInstance.extraReducers';
import * as reducers from './ProcessInstance.reducers';
import { ProcessInstanceState } from './ProcessInstance.state';
import * as processInstanceThunks from './ProcessInstance.thunks';
import { RootState } from '../../index';

export const initialState: ProcessInstanceState = {
    allActiveMap: {},
    active: {
        orchestratorProcessInstanceId: null,
        processInstance: null,
        eventsMap: {},
        jobsMap: {},
    },
    all: {
        byId: {},
        byProcessId: {},
        ids: [],
        loading: false,
        loadingPage: false,
        page: null,
    },
};

export const slice = createSlice({
    name: 'processInstance',
    initialState,
    reducers,
    extraReducers: buildProcessInstanceExtraReducers,
});

export const processInstanceSelector = (state: RootState) => state.processInstance;

export const processInstanceReducer = slice.reducer;

export const processInstanceActions = {
    ...slice.actions,
    ...processInstanceThunks,
};
