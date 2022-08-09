import { createSlice } from '@reduxjs/toolkit';

import { RootState } from 'src/store';

import { GlobalVariableState } from './GlobalVariable.state';
import * as globalVariableThunks from './GlobalVariable.thunks';

import buildGlobalVariablesExtraReducers from './GlobalVariable.extraReducers';

const initialState: GlobalVariableState = {
    globalVariables: [],
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
