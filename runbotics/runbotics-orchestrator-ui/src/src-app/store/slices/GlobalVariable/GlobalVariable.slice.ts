import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import buildGlobalVariablesExtraReducers from './GlobalVariable.extraReducers';
import { GlobalVariableState } from './GlobalVariable.state';
import * as globalVariableThunks from './GlobalVariable.thunks';


const initialState: GlobalVariableState = {
    globalVariables: null,
    loading: false,
};

export const slice = createSlice({
    name: 'global-variables',
    initialState,
    reducers: {},
    extraReducers: buildGlobalVariablesExtraReducers,
});

export const globalVariableSelector = (state: RootState) => state.globalVariable;

export const globalVariableReducer = slice.reducer;

export const globalVariableActions = {
    ...slice.actions,
    ...globalVariableThunks,
};
