import { CredentialCollection } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import {
    EditCredentialsCollectionDto
} from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';


const CREDENTIALS_COLLECTION_PATH = 'credential-collections';

export const fetchAllCredentialCollections = ApiTenantResource
    .get<CredentialCollection[]>(
        'credentialCollection/fetchAll',
        CREDENTIALS_COLLECTION_PATH
    );

export const fetchOneCredentialCollection = ApiTenantResource
    .get<CredentialCollection>(
        'credentialCollection/fetchOne/:id',
        CREDENTIALS_COLLECTION_PATH
    );

export const createCredentialCollection = ApiTenantResource
    .post<CredentialCollection, EditCredentialsCollectionDto>(
        'credentialCollection/create',
        CREDENTIALS_COLLECTION_PATH
    );

export const updateCredentialCollection = ApiTenantResource
    .patch<CredentialCollection, EditCredentialsCollectionDto>(
        'credentialCollection/update/:id',
        CREDENTIALS_COLLECTION_PATH
    );

export const deleteCredentialCollections = ApiTenantResource
    .delete<void>(
        'credentialCollection/delete/:id',
        CREDENTIALS_COLLECTION_PATH
    );
