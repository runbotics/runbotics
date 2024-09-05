import { CredentialCollection } from './credential-collection.model';
import { CredentialTemplate } from './credential-template.model';
import { Tenant } from './tenant.model';
import { UserDTO } from './user.model';

export interface Credential {
    id?: string;
    name?: string;
    tenantId?: string;
    tenant?: Tenant;
    description?: string;
    collectionId?: string;
    collection?: CredentialCollection;
    createdById?: string;
    createdBy?: UserDTO;
    updatedBy?: UserDTO;
    updatedById?: string;
    templateId?: string;
    template?: CredentialTemplate;
    createdAt?: string;
    updatedAt?: string;
};
