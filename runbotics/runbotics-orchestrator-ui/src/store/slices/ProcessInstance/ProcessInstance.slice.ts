import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../index';
import buildProcessInstanceExtraReducers from './ProcessInstance.extraReducers';
import * as reducers from './ProcessInstance.reducers';
import { ProcessInstanceState } from './ProcessInstance.state';
import * as processInstanceThunks from './ProcessInstance.thunks';

export const initialState: ProcessInstanceState = {
    active: {
        orchestratorProcessInstanceId: null,
        processInstance: null,
        eventsMap: {},
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
