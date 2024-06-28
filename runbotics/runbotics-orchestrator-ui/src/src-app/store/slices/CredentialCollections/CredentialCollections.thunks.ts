import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import {
    BasicCredentialsCollectionDto,
    CreateCredentialsCollectionDto,
    EditCredentialsCollectionDto
} from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

const PARENT_URL_PATH = 'api/scheduler/credential-collection';

// export const fetchAllCredentialCollections = createAsyncThunk('api/admin/credentialCollections', () => tempCredentialsCollections);

// export const fetchUserCredentialCollection = createAsyncThunk('api/credentials', (userId: string) => {
//     const allCollections = tempCredentialsCollections;
//     const filteredCollection = allCollections.filter(collection =>
//         collection.users?.some(user => user.userId === userId)
//     );

//     return filteredCollection;
// });

export const fetchAllCredentialCollections = createAsyncThunk<BasicCredentialsCollectionDto[]>('credentialCollection/fetchAll', () =>
    axios.get(PARENT_URL_PATH)
);

export const findOneCredentialCollection = createAsyncThunk<BasicCredentialsCollectionDto[]>(
    'credentialCollection/fetchOne/:id',
    (credentialCollectionId, { rejectWithValue }) =>
        axios
            .get(`${PARENT_URL_PATH}/${credentialCollectionId}`)
            .then(response => response.data)
            .then(error => rejectWithValue(error.response.data))
);

export const createCredentialCollection = createAsyncThunk<CreateCredentialsCollectionDto, BasicCredentialsCollectionDto>(
    'credentialCollection/create',
    (credentialCollection: CreateCredentialsCollectionDto, { rejectWithValue }) =>
        axios
            .post(PARENT_URL_PATH, credentialCollection)
            .then(response => response.data)
            .then(error => rejectWithValue(error.response.data))
);

export const updateCredentialCollection = createAsyncThunk<BasicCredentialsCollectionDto, BasicCredentialsCollectionDto>(
    'credentialCollection/update',
    async (credentialCollection: EditCredentialsCollectionDto, { rejectWithValue }) => {
        const { name, color, description, users } = credentialCollection;

        const response = await axios.post(PARENT_URL_PATH, { name, color, description, users });
        const error = response.data;
        return rejectWithValue(error.response.data);
    }
);

export const deleteCredentialCollections = createAsyncThunk(
    'credentialCollection/delete/:id',
    (credentialCollectionId: string, { rejectWithValue }) =>
        axios
            .delete(`${PARENT_URL_PATH}/${credentialCollectionId}`)
            .then(() => credentialCollectionId)
            .catch(error => rejectWithValue(error.response.data))
);
