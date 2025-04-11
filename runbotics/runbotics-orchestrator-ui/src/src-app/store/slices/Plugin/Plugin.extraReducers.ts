import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { PluginState } from './Plugin.state';
import { loadPlugins } from './Plugin.thunks';

const buildPluginExtraReducers = (
    builder: ActionReducerMapBuilder<PluginState>
) => {
    builder
        .addCase(loadPlugins.fulfilled, (state, { payload }) => {
            state.loadedPlugins = payload;
        })
        .addCase(loadPlugins.rejected, (state) => {
            state.loadedPlugins = [];
        });
};

export default buildPluginExtraReducers;
