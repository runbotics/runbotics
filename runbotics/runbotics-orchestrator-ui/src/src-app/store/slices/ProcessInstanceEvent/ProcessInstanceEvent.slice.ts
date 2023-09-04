import { createSlice } from '@reduxjs/toolkit';

import buildProcessInstanceEventExtraReducers from './ProcessInstanceEvent.extraReducers';
import * as reducers from './ProcessInstanceEvent.reducers';
import { EventMapTypes, ProcessInstanceEventState } from './ProcessInstanceEvent.state';
import * as processInstanceEventThunks from './ProcessInstanceEvent.thunks';
import { RootState } from '../../index';

export const initialState: ProcessInstanceEventState = {
    all: {
        events: [],
        nestedEvents: {},
        eventsBreadcrumbTrail: [                
            {
                id: 'root',
                labelKey: 'Component.InfoPanel.Root.Breadcrumb',
                type: EventMapTypes.ProcessInstanceEvent,
            },
        ],
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
