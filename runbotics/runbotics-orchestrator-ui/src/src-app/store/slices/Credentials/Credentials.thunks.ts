
import { Credential, ProcessCredential } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import { BasicCredentialDto, CreateCredentialDto, EditCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';
import { EditAtributeDto } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/Attribute.types';


const COLLECTION_CREDENTIAL_PATH = 'credential-collections/:collectionId/credentials';
const CREDENTIAL_PATH = 'credentials';

export const createCredential = ApiTenantResource
    .post<BasicCredentialDto, CreateCredentialDto>('credential/create', 'credential-collections');

export const fetchAllCredentialsInCollection = ApiTenantResource
    .get<BasicCredentialDto[]>('credential/fetchAllInCollection', 'credential-collections');

export const fetchAllCredentialsAccessibleInTenant = ApiTenantResource
    .get<BasicCredentialDto[]>('credential/fetchAllInTenant', CREDENTIAL_PATH);

export const fetchAllCredentialsByTemplateAndProcess = ApiTenantResource
    .get<Credential[]>('credential/fetchAllByTemplateAndProcess', 'credentialsByTemplateAndProcess');

export const fetchOneCredential = ApiTenantResource
    .get<BasicCredentialDto>('credential/fetchOne/:id', CREDENTIAL_PATH);

export const updateCredential = ApiTenantResource
    .patch<BasicCredentialDto, EditCredentialDto>('credenital/update/:id', COLLECTION_CREDENTIAL_PATH);

export const deleteCredential = ApiTenantResource
    .delete<void>('credential/delete/:id', COLLECTION_CREDENTIAL_PATH);

export const updateAttribute = ApiTenantResource
    .patch<BasicCredentialDto, EditAtributeDto>(':credentialId/UpdateAttribute/:attributeName', CREDENTIAL_PATH);

export const fetchAllCredentialsAssignedToProcess = ApiTenantResource
    .get<ProcessCredential[]>(':processId', 'process-credentials/processes');
