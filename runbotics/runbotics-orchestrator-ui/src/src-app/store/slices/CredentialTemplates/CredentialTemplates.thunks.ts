import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import { CredentialTemplate } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/Attribute.types';

const CREDENTIAL_TEMPLATE_PATH = 'credential-templates';

export const fetchAllTemplates = ApiTenantResource
    .get<CredentialTemplate[]>('template/fetchAllInTenant', CREDENTIAL_TEMPLATE_PATH);

export const fetchOneTemplate = ApiTenantResource
    .get<CredentialTemplate>('template/fetchOne/:id', CREDENTIAL_TEMPLATE_PATH);

