import { createSlice } from '@reduxjs/toolkit';

import LoadingType from '#src-app/types/loading';
import { defaultValue } from '#src-app/types/model/action.model';

import buildActionExtraReducers from './Action.extraReducers';
import { ActionState } from './Action.state';
import * as actionThunks from './Action.thunks';

const initialState: ActionState = {
    draft: {
        loading: LoadingType.IDLE,
        action: { ...defaultValue },
        currentRequestId: undefined,
        error: null,
    },
 
    showEditModal: false,
    actions: {
        loading: false,
        byId: {},
        allIds: [],
    },
    bpmnActions: {
        external: [],
        byId: {},
    },
};

const slice = createSlice({
    name: 'action',
    initialState,
    reducers: {},
    extraReducers: buildActionExtraReducers,
});

export const actionReducer = slice.reducer;

export const activityActions = {
    ...slice.actions,
    ...actionThunks,
};
