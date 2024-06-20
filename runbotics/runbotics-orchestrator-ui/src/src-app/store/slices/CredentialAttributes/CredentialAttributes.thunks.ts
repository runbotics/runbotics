import { createAsyncThunk } from '@reduxjs/toolkit';

import { initialAttributes } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.utils';

export const getAttributes = createAsyncThunk('api/credential/credentialId', () => initialAttributes);

export const fetchAttributes = createAsyncThunk(
    'attributes/fetchAttributes',
    async (credentialId: string) => initialAttributes.filter(attr => attr.credentialId === credentialId)

    // const response = await fetch(`/api/attributes?credentialId=${credentialId}`);

    // return (await response.json()) as BasicAttributeDto[];
);
