import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import {
    BasicCredentialsCollectionDto,
    EditCredentialsCollectionDto
} from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

const CREDENTIALS_COLLECTION_PATH = 'credential-collections';

export const fetchAllCredentialCollections = ApiTenantResource
    .get<BasicCredentialsCollectionDto[]>(
        'credentialCollection/fetchAll',
        CREDENTIALS_COLLECTION_PATH
    );

export const fetchOneCredentialCollection = ApiTenantResource
    .get<BasicCredentialsCollectionDto>(
        'credentialCollection/fetchOne/:id',
        CREDENTIALS_COLLECTION_PATH
    );

export const createCredentialCollection = ApiTenantResource
    .post<BasicCredentialsCollectionDto, EditCredentialsCollectionDto>(
        'credentialCollection/create',
        CREDENTIALS_COLLECTION_PATH
    );

export const updateCredentialCollection = ApiTenantResource
    .patch<BasicCredentialsCollectionDto, EditCredentialsCollectionDto>(
        'credentialCollection/update/:id',
        CREDENTIALS_COLLECTION_PATH
    );

export const deleteCredentialCollections = ApiTenantResource
    .delete<void>(
        'credentialCollection/delete/:id',
        CREDENTIALS_COLLECTION_PATH
    );
