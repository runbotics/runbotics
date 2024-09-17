import { CredentialCollection } from './credential-collection.model';
import { CredentialTemplate } from './credential-template.model';
import { Tenant } from './tenant.model';
import { UserDTO } from './user.model';

export interface Credential {
    id: string;
    name: string;
    tenantId: string;
    tenant: Tenant;
    description: string;
    collectionId: string;
    collection: CredentialCollection;
    createdById: string;
    createdBy: UserDTO;
    updatedBy: UserDTO;
    updatedById: string;
    templateId: string;
    template: CredentialTemplate;
    createdAt: string;
    updatedAt: string;
};

export interface CredentialDto
    extends Pick<Credential, "id" | "name" | "createdBy"> {
    template: Omit<CredentialTemplate, 'description'>;
    collection: Pick<CredentialCollection, 'id' | 'name'>;
}

export interface DecryptedCredential {
    id: string;
    name: string;
    order: number;
    template: string;
    attributes: {
        id: string;
        name: string;
        value: string;
    }[];
}
