import { createSlice } from '@reduxjs/toolkit';
import LoadingType from 'src/types/loading';
import internalBpmnActions from 'src/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Actions';
import { defaultValue } from 'src/types/model/action.model';
import * as actionThunks from './Action.thunks';
import { ActionState } from './Action.state';
import buildActionExtraReducers from './Action.extraReducers';

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
