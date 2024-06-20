import { createAsyncThunk } from '@reduxjs/toolkit';

import { tempCredentialsCollections } from '#src-app/views/credentials/CredentialsCollection/CredenitlaCollection.utils';

export const fetchAllCredentialCollections = createAsyncThunk('api/admin/credentialCollections', () => tempCredentialsCollections);

export const fetchUserCredentialCollection = createAsyncThunk('api/credentials', (userId: string) => {
    const allCollections = tempCredentialsCollections;
    const filteredCollection = allCollections.filter(collection => 
        collection.users?.some(user => user.userId === userId)
    );

    return filteredCollection;
});
