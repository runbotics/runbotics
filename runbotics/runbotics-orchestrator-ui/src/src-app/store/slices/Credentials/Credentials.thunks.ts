import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

import { BasicCredentialDto, CreateCredentialDto, EditCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';
import { tempCredentials } from '#src-app/views/credentials/Credentials/Credentials.utils';

// export const fetchAllCredentials = createAsyncThunk('api/admin/credentials', () => tempCredentials);

// export const fetchCollectionCredentials = createAsyncThunk('api/credentials', (collectionId: string) => {
//     console.log(tempCredentials);
//     return tempCredentials.filter(credential => credential.collectionId === collectionId);
// });

const ENV = 'dev';
const PARENT_URL_PATH = 'app/credentials';

export const createCredential = createAsyncThunk<BasicCredentialDto, CreateCredentialDto>(
    'credential/create',
    (credential, { rejectWithValue }) =>
        axios
            .post(PARENT_URL_PATH, credential)
            .then(response => response.data)
            .then(error => rejectWithValue(error.response.data))
);

export const fetchAllCredentials = createAsyncThunk<BasicCredentialDto[]>(
    'credential/findAll',
    (credentialCollectionId, { rejectWithValue }) => {
        if (ENV === 'dev') return tempCredentials;
        return axios
            .get(`${PARENT_URL_PATH}/${credentialCollectionId}`)
            .then(response => response.data)
            .then(error => rejectWithValue(error.response.data)); }
);

export const fetchOneCredential = createAsyncThunk<BasicCredentialDto, string>('credential/findOne', (credentialId, { rejectWithValue }) => {
    if (ENV === 'dev') return tempCredentials[0];
    return axios
        .get(`${PARENT_URL_PATH}/${credentialId}`)
        .then(response => response.data)
        .then(error => rejectWithValue(error.response.data));
}
);

export const updateCredential = createAsyncThunk<BasicCredentialDto, EditCredentialDto>(
    'credential/update',
    async (credential, { rejectWithValue }) => {
        const { name, template, description, id } = credential;

        try {
            const response = await axios.patch<BasicCredentialDto>(`${PARENT_URL_PATH}/${id}`, { name, template, description });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteCredential = createAsyncThunk<string, string>('credential/delete', (credentialId, { rejectWithValue }) =>
    axios
        .delete(`${PARENT_URL_PATH}/${credentialId}`)
        .then(() => credentialId)
        .catch(error => rejectWithValue(error.response.data))
);
