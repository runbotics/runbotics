import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CreateClientRegistrationWebhookRequest } from 'runbotics-common';

import { RootState } from '#src-app/store';
import buildWebhooksExtraReducers from '#src-app/store/slices/Webhook/Webhook.extraReducers';

import { WebhookState } from './Webhook.state';
import * as webhookThunks from './Webhook.thunks';

const initialState: WebhookState = {
    loading: false,
    error: null,
    search: '',
    webhooks: null,
    triggers: null,
    tokenExpirationDate: null,
    registerWebhook: null,
    isModalOpen: false,
};

export const slice = createSlice({
    name: 'webhooks',
    initialState,
    reducers: {
        setSearch(state, action:PayloadAction<string>) {
            state.search = action.payload;
        },
        setIsModalOpen(state, action:PayloadAction<boolean>) {
            state.isModalOpen = action.payload;
        },
        setRegistrationForm(state, action:PayloadAction<CreateClientRegistrationWebhookRequest>) {
            state.registerWebhook = action.payload;
        }
    },
    extraReducers: builder => buildWebhooksExtraReducers(builder),
});

export const webhookReducer = slice.reducer;

export const webhookSelector = (state: RootState) => state.webhook;

export const webhookActions = {
    ...slice.actions,
    ...webhookThunks,
};
