import { PayloadAction } from '@reduxjs/toolkit';

import { EditAtributeDto } from '../../../views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.types';

export const updateAttribute = (state: EditAtributeDto, action: PayloadAction<EditAtributeDto>) => {
    state.description = action.payload.description,
    state.name = action.payload.description,
    state.value = action.payload.value;
};
