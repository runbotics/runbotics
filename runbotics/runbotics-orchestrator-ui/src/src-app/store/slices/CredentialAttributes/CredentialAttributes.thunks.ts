import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

import {
    Attribute,
    BasicAttributeDto,
    CreateAttributeDto,
    EditAtributeDto
} from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.types';
import { initialAttributes } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.utils';

const env = 'DEV';
const PARENT_URL_PATH = 'credentialId/credential-attributes';

export const fetchAttributes = createAsyncThunk('attributes/fetchAttributes', (credentialId: string) => {
    if (env === 'DEV') {
        return initialAttributes.filter(attr => attr.credentialId === credentialId);
    }

    return axios.get<BasicAttributeDto[]>(PARENT_URL_PATH).then(response => response.data);
});

export const addAttribute = createAsyncThunk('attribute/create', (attribute: CreateAttributeDto, { rejectWithValue }) => {
    if (env === 'DEV') {
        return new Promise<Attribute>(resolve => setTimeout(() => resolve(attribute as Attribute), 50));
    }

    return axios
        .post<Attribute>(PARENT_URL_PATH, attribute)
        .then(response => response.data)
        .catch(error => rejectWithValue(error.response.data));
});

export const updateAttribute = createAsyncThunk('attributes/update/:id', (attribute: EditAtributeDto, { rejectWithValue }) => {
    const {name, value, description} = attribute;

    return axios
        .patch<Attribute>(`${PARENT_URL_PATH}/${attribute.id}`, {name, value, description})
        .then(response => response.data)
        .catch(error => rejectWithValue(error.response.data));
}
);

export const deleteAttribute = createAsyncThunk<string, string>('attributes/delete/:id', (attributeId, { rejectWithValue }) =>
    axios
        .delete<string>(`${PARENT_URL_PATH}/${attributeId}`)
        .then(() => attributeId)
        .catch(error => rejectWithValue(error.response.data))
);
