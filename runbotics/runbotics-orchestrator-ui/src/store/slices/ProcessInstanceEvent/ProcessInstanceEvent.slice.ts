import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../index';
import buildProcessInstanceEventExtraReducers from './ProcessInstanceEvent.extraReducers';
import { ProcessInstanceEventState } from './ProcessInstanceEvent.state';
import * as processInstanceEventThunks from './ProcessInstanceEvent.thunks';
import * as reducers from './ProcessInstanceEvent.reducers';

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
