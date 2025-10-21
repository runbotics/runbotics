import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';
import { ICreateClientRegistrationWebhookRequest, WebhookState } from '#src-app/store/slices/Webhook/Webhook.state';

const initialState: WebhookState = {
    loading: false,
    error: null,
    search: '',
    webhooks: null,
    triggers: null,
    tokenExpirationDate: null,
    registerWebhook: null
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
        setRegistrationForm(state, action:PayloadAction<ICreateClientRegistrationWebhookRequest>) {
            state.registerWebhook = action.payload;
        }
    },
});

export const webhookReducer = slice.reducer;

export const webhookSelector = (state: RootState) => state.webhooks;

export const webhookActions = {
    ...slice.actions,
};
