
import { Credential, FrontCredentialDto, ProcessCredential, UpdateProcessCredential } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import { Page } from '#src-app/utils/types/page';
import { CreateCredentialDto, EditCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';
import { EditAtributeDto } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/Attribute.types';


const COLLECTION_CREDENTIAL_PATH = 'credential-collections/:collectionId/credentials';
const CREDENTIAL_PATH = 'credentials';
const PROCESS_CREDENTIAL_PATH = 'process-credentials/processes';

export const createCredential = ApiTenantResource
    .post<Credential, CreateCredentialDto>('credential/create', 'credential-collections');

export const fetchAllCredentialsInCollection = ApiTenantResource
    .get<FrontCredentialDto[]>('credential/fetchAllInCollection', 'credential-collections');

export const fetchAllCredentialsAccessibleInTenant = ApiTenantResource
    .get<FrontCredentialDto[]>('credential/fetchAllInTenant', CREDENTIAL_PATH);

export const fetchAllCredentialsByTemplateAndProcess = ApiTenantResource
    .get<Credential[]>('credential/fetchAllByTemplateAndProcess', 'credentialsByTemplateAndProcess');

export const fetchAllCredentialsAccessibleInTenantByPage = ApiTenantResource
    .get<Page<FrontCredentialDto>>('credential/fetchAllByPage', `${CREDENTIAL_PATH}/GetPage`);

export const fetchOneCredential = ApiTenantResource
    .get<FrontCredentialDto>('credential/fetchOne/:id', CREDENTIAL_PATH);

export const updateCredential = ApiTenantResource
    .patch<Credential, EditCredentialDto>('credenital/update/:id', 'credential-collections');

export const deleteCredential = ApiTenantResource
    .delete<void>('credential/delete/:id', COLLECTION_CREDENTIAL_PATH);

export const updateAttribute = ApiTenantResource
    .patch<Credential, EditAtributeDto>(':credentialId/UpdateAttribute/:attributeName', CREDENTIAL_PATH);

export const fetchAllCredentialsAssignedToProcess = ApiTenantResource
    .get<ProcessCredential[]>(':processId', PROCESS_CREDENTIAL_PATH);

export const updateCredentialsAssignedToProcess = ApiTenantResource
    .patch<ProcessCredential[], UpdateProcessCredential[]>(':processId/updateCredentials', PROCESS_CREDENTIAL_PATH);
