import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../index';
import buildProcessInstanceEventExtraReducers from './ProcessInstanceEvent.extraReducers';
import * as reducers from './ProcessInstanceEvent.reducers';
import { ProcessInstanceEventState } from './ProcessInstanceEvent.state';
import * as processInstanceEventThunks from './ProcessInstanceEvent.thunks';

export const initialState: ProcessInstanceEventState = {
    all: {
        events: [],
        loading: false,
    },
};

export const slice = createSlice({
    name: 'processInstanceEvent',
    initialState,
    reducers,
    extraReducers: buildProcessInstanceEventExtraReducers,
});

export const processInstanceEventSelector = (state: RootState) => state.processInstanceEvent;

export const processInstanceEventReducer = slice.reducer;

export const processInstanceEventActions = {
    ...slice.actions,
    ...processInstanceEventThunks,
};
