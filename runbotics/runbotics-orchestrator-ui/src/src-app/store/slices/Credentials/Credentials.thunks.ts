import { Credential } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';

export const fetchAllCredentialsAccessibleInTenant = ApiTenantResource.get<Credential[]>('credential/fetchAllInTenant', 'credentials');
