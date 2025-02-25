import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

import { LoadedPlugin } from './Plugin.state';

export const loadPlugins = createAsyncThunk<LoadedPlugin[]>(
    'plugin/loadPlugins',
    async (_, { rejectWithValue }) => {
        try {
            const availablePlugins = (
                await axios.get<{ plugins: string[] }>('/api/plugins/check')
            ).data;
            const loadedPlugins = await Promise.all<LoadedPlugin>(
                availablePlugins.plugins.map(async (pluginName) => {
                    const loadedPlugin = await axios.get(
                        `/api/plugins/${pluginName}/load`
                    );
                    const pluginModule = await import(
                        /* webpackIgnore: true */
                        URL.createObjectURL(
                            new Blob([loadedPlugin.data], {
                                type: 'application/javascript',
                            })
                        )
                    );

                    return pluginModule.default;
                })
            );

            return loadedPlugins;
        } catch (error) {
            if (!axios.isAxiosError(error)) {
                throw error;
            }

            console.warn(error.response.data.error);
            return rejectWithValue(error.response.data.error);
        }
    }
);
