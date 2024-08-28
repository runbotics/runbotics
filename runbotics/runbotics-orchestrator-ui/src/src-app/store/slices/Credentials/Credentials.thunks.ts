import ApiTenantResource from '#src-app/utils/ApiTenantResource';

import { Credential } from './Credentials.state';

export const getAllForProcessAndTemplate = ApiTenantResource.get<Credential[]>('credential/fetchAllInTenant', 'credentials');
