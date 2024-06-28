import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { CredentialAttributesState } from './CredentialAttributes.state';
import { fetchAttributes, addAttribute, updateAttribute, deleteAttribute } from './CredentialAttributes.thunks';


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
        })
        .addCase(addAttribute.pending, (state) => {
            state.loading = true;
        })
        .addCase(addAttribute.fulfilled, (state, action) => {
            state.loading = false;
            state.data.push(action.payload);
        })
        .addCase(addAttribute.rejected, (state) => {
            state.loading = false;
        })
        .addCase(updateAttribute.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateAttribute.fulfilled, (state, action) => {
            state.loading = false;
            const notUpdatedAttributes = state.data.filter(attribute => attribute.id !== action.payload.id);
            state.data = [...notUpdatedAttributes, action.payload];
        })
        .addCase(updateAttribute.rejected, (state) => {
            state.loading = false;
        })
        .addCase(deleteAttribute.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteAttribute.fulfilled, (state, action) => {
            state.loading = false;
            state.data = state.data.filter(attribute => attribute.id !== action.payload);
        })
        .addCase(deleteAttribute.rejected, (state) => {
            state.loading = false;
        });
};

export default buildCredentialAttributeExtraReducers;
