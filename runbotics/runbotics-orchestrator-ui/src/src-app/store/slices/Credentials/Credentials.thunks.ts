

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import { BasicCredentialDto, CreateCredentialDto, EditCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';
import { EditAtributeDto } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/Attribute.types';

const CREDENTIAL_PATH = 'credential-collections/:collectionId/credentials/';

export const createCredential = ApiTenantResource.post<BasicCredentialDto, CreateCredentialDto>('credential/create', 'credential-collections');

export const fetchAllCredentialsInCollection = ApiTenantResource.get<BasicCredentialDto[]>('credential/fetchAllInCollection', 'credential-collections');

export const fetchAllCredentialsAccessibleInTenant = ApiTenantResource.get<BasicCredentialDto[]>('credential/fetchAllInTenant', 'credentials');

export const fetchOneCredential = ApiTenantResource.get<BasicCredentialDto>('credential/fetchOne/:id', 'credentials');

export const updateCredential = ApiTenantResource.patch<BasicCredentialDto, EditCredentialDto>('credenital/update/:id', CREDENTIAL_PATH);

export const deleteCredential = ApiTenantResource.delete<void>('credential/delete/:id', CREDENTIAL_PATH);

export const updateAttribute = ApiTenantResource.patch<BasicCredentialDto, EditAtributeDto>(':credentialId/UpdateAttribute/:attributeName', 'credentials');
