import { CredentialDto } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';

export const fetchAllCredentialsAccessibleInTenant = ApiTenantResource.get<CredentialDto[]>('credential/fetchAllInTenant', 'credentials');
