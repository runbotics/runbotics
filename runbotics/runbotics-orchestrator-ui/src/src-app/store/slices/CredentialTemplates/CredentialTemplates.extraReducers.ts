import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { CredentialTemplatesState } from './CredentialTemplates.state';
import { fetchAllTemplates, fetchOneTemplate } from './CredentialTemplates.thunks';


const buildCredentialTemplatesExtraReducers =(builder:ActionReducerMapBuilder<CredentialTemplatesState>) => {
    builder
        .addCase(fetchAllTemplates.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllTemplates.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(fetchAllTemplates.rejected, (state) => {
            state.loading = false;
        })
        .addCase(fetchOneTemplate.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchOneTemplate.fulfilled, (state, action) => {
            state.loading = false;
            state.data = [action.payload];
        })
        .addCase(fetchOneTemplate.rejected, (state) => {
            state.loading = false;
        });
};

export default buildCredentialTemplatesExtraReducers;
