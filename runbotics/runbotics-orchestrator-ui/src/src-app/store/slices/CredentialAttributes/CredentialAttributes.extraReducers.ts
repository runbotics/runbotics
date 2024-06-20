import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { CredentialAttributesState } from './CredentialAttributes.state';
import { fetchAttributes } from './CredentialAttributes.thunks';


const buildCredentialAttributeExtraReducers =(builder:ActionReducerMapBuilder<CredentialAttributesState>) => {
    builder
        .addCase(fetchAttributes.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAttributes.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(fetchAttributes.rejected, (state) => {
            state.loading = false;
        });
};

export default buildCredentialAttributeExtraReducers;
