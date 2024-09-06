import { Credential } from './credential.model';
import { Tenant } from './tenant.model';
import { UserDTO } from './user.model';

export interface CredentialCollection {
    id: string;
    name: string;
    tenantId: string;
    tenant: Tenant;
    description: string;
    createdBy: UserDTO;
    createdById: string;
    updatedBy: UserDTO;
    updatedById: string;
    credentials: Credential[];
    color: string;
    accessType: string;
    createdAt: string;
    updatedAt: string;
}
