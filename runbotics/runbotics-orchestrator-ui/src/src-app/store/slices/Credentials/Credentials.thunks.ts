import { createAsyncThunk } from '@reduxjs/toolkit';

import { tempCredentials } from '#src-app/views/credentials/Credentials/Credentials.utils';

export const fetchAllCredentials = createAsyncThunk('api/admin/credentials', () => tempCredentials);

export const fetchCollectionCredentials = createAsyncThunk('api/credentials', (collectionId: string) => {
    console.log(tempCredentials);
    return tempCredentials.filter(credential => credential.collectionId === collectionId);
});

