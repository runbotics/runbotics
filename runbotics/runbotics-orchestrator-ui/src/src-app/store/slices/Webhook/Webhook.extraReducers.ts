import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { WebhookState } from '#src-app/store/slices/Webhook/Webhook.state';
import { getWebhooks } from '#src-app/store/slices/Webhook/Webhook.thunks';

const buildWebhooksExtraReducers = (builder: ActionReducerMapBuilder<WebhookState>) => {
    builder
        // GET ALL
        .addCase(getWebhooks.pending, (state) => {
            state.loading = true;
        })
        .addCase(getWebhooks.fulfilled, (state, action) => {
            state.webhooks = action.payload;
            state.loading = false;
        })
        .addCase(getWebhooks.rejected, (state) => {
            state.loading = false;
        });
};


export default buildWebhooksExtraReducers;
