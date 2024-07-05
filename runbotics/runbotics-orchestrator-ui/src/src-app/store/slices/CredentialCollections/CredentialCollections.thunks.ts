import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { tempCredentialsCollections } from '#src-app/views/credentials/CredentialsCollection/CredenitlaCollection.utils';
import {
    BasicCredentialsCollectionDto,
    CreateCredentialsCollectionDto,
    EditCredentialsCollectionDto
} from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

const PARENT_URL_PATH = 'api/scheduler/credential-collection';
const env = 'DEV';

export const fetchAllCredentialCollections = createAsyncThunk<BasicCredentialsCollectionDto[]>('credentialCollection/fetchAll', () =>
{
    if (env === 'DEV') return tempCredentialsCollections;
    return axios.get(PARENT_URL_PATH);
}    
    
);

export const fetchOneCredentialCollection = createAsyncThunk<BasicCredentialsCollectionDto[]>(
    'credentialCollection/fetchOne/:id',
    (credentialCollectionId, { rejectWithValue }) =>
        axios
            .get(`${PARENT_URL_PATH}/${credentialCollectionId}`)
            .then(response => response.data)
            .then(error => rejectWithValue(error.response.data))
);

export const createCredentialCollection = createAsyncThunk<BasicCredentialsCollectionDto, CreateCredentialsCollectionDto>(
    'credentialCollection/create',
    (credentialCollection, { rejectWithValue }) =>
        axios
            .post(PARENT_URL_PATH, credentialCollection)
            .then(response => response.data)
            .then(error => rejectWithValue(error.response.data))
);

export const updateCredentialCollection = createAsyncThunk<BasicCredentialsCollectionDto, EditCredentialsCollectionDto>(
    'credentialCollection/update',
    async (credentialCollection, { rejectWithValue }) => {
        const { name, color, description, users, id } = credentialCollection;

        try {
            const response = await axios.patch(`${PARENT_URL_PATH}/${id}`, { name, color, description, users });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteCredentialCollections = createAsyncThunk<string, string>(
    'credentialCollection/delete/:id',
    (credentialCollectionId, { rejectWithValue }) =>
        axios
            .delete(`${PARENT_URL_PATH}/${credentialCollectionId}`)
            .then(() => credentialCollectionId)
            .catch(error => rejectWithValue(error.response.data))
);
