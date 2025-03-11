import { createAsyncThunk } from '@reduxjs/toolkit';

import AxiosInstance from 'axios';

import { LoadedPlugin } from './Plugin.state';

import { AppDispatch, RootState } from '#src-app/store';
import axios from '#src-app/utils/axios';

export const loadPlugins = createAsyncThunk<
    LoadedPlugin[],
    null,
    {
        state: RootState;
        requestId: string;
        rejectValue: unknown;
        dispatch: AppDispatch;
    }
>('plugin/loadPlugins', async (_, { rejectWithValue, getState }) => {
    try {
        const tenantId = getState().auth.user.tenant.id;

        const availablePlugins = (
            await axios.post<{ plugins: string[] }>('/api/plugins/check', {
                tenantId,
            })
        ).data;

        const loadedPlugins = await Promise.all<LoadedPlugin>(
            availablePlugins.plugins.map(async (pluginName) => {
                const loadedPlugin = await axios.post(
                    `/api/plugins/${pluginName}/load`,
                    {
                        tenantId,
                    }
                );

                const pluginModule = await import(
                    /* webpackIgnore: true */
                    URL.createObjectURL(
                        new Blob([loadedPlugin.data], {
                            type: 'application/javascript',
                        })
                    )
                ).catch((e) => {
                    console.error(e);
                });

                return pluginModule.default;
            })
        );

        return loadedPlugins;
    } catch (error) {
        if (!AxiosInstance.isAxiosError(error)) {
            throw error;
        }

        console.warn(error.response.data.error);
        return rejectWithValue(error.response.data.error);
    }
});
