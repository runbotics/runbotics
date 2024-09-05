

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import { BasicCredentialDto, CreateCredentialDto, EditCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

const CREDENTIAL_PATH = 'credential-collections/:collectionId/credentials/';

export const createCredential = ApiTenantResource.post<BasicCredentialDto, CreateCredentialDto>('credential/create', 'credential-collections');

export const fetchAllCredentialsInCollection = ApiTenantResource.get<BasicCredentialDto[]>('credential/fetchAllInCollection', 'credential-collections');

export const fetchAllCredentialsAccessibleInTenant = ApiTenantResource.get<BasicCredentialDto[]>('credential/fetchAllInTenant', 'credentials');

export const fetchOneCredential = ApiTenantResource.get<BasicCredentialDto>('credenital/fetchOne/:id', CREDENTIAL_PATH);

export const updateCredential = ApiTenantResource.patch<BasicCredentialDto, EditCredentialDto>('credenital/update/:id', CREDENTIAL_PATH);

export const deleteCredential = ApiTenantResource.delete<void>('credential/delete/:id', CREDENTIAL_PATH);
