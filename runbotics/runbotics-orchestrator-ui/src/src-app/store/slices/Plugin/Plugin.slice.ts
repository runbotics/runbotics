import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import extraReducers from './Plugin.extraReducers';
import * as reducers from './Plugin.reducers';
import { PluginState } from './Plugin.state';
import * as pluginThunks from './Plugin.thunks';

export const initialState: PluginState = {
    pluginBpmnActions: {},
    pluginBpmnActionsMap: new Map(),
    pluginActionsGroupLabelMap: new Map(),
    loadedPlugins: [],
};

export const slice = createSlice({
    name: 'plugin',
    initialState,
    reducers,
    extraReducers,
});

export const pluginReducer = slice.reducer;

export const pluginSelector = (state: RootState) => state.plugin;

export const pluginActions = {
    ...slice.actions,
    ...pluginThunks,
};
