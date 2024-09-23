import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { CredentialTemplatesState } from './CredentialTemplates.state';
import { fetchAllTemplates, fetchOneTemplate } from './CredentialTemplates.thunks';


const buildCredentialTemplatesExtraReducers =(builder:ActionReducerMapBuilder<CredentialTemplatesState>) => {
    builder
        // fetch all templates
        .addCase(fetchAllTemplates.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllTemplates.fulfilled, (state, action) => {
            state.loading = false;
            state.credentialTemplates = action.payload;
        })
        .addCase(fetchAllTemplates.rejected, (state) => {
            state.loading = false;
        })

        // fetch one template
        .addCase(fetchOneTemplate.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchOneTemplate.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(fetchOneTemplate.rejected, (state) => {
            state.loading = false;
        });
};

export default buildCredentialTemplatesExtraReducers;
