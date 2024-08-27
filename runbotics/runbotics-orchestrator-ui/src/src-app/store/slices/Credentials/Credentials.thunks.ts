import ApiTenantResource from '#src-app/utils/ApiTenantResource';

import { Credential } from './Credentials.state';

export const fetchAllCredentialsAccessibleInTenant = ApiTenantResource.get<Credential[]>('credential/fetchAllInTenant', 'credentials');
