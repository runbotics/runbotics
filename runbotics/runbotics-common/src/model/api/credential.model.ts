import { CredentialCollection } from './credential-collection.model';
import { CredentialTemplate } from './credential-template.model';
import { Tenant } from './tenant.model';
import { BasicUserDto } from './user.model';

export interface Credential {
    id: string;
    name: string;
    tenantId: string;
    tenant: Tenant;
    description?: string;
    collectionId: string;
    collection: CredentialCollection;
    createdById: number;
    createdBy: BasicUserDto;
    updatedBy: BasicUserDto;
    updatedById: number;
    templateId: string;
    template: CredentialTemplate;
    createdAt: string;
    updatedAt: string;
    attributes: Attribute[];
}

export interface Attribute {
    id: string;
    name: string;
    tenant: Tenant;
    tenantId: string;
    description?: string;
    masked: boolean;
    secretId: string;
    credentialId: string;
}

export interface FrontCredentialDto
    extends Pick<
        Credential,
        'id' | 'name' | 'collectionId' | 'templateId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'description'
    > {
    attributes: Attribute[];
    template: Omit<CredentialTemplate, 'description'>;
    collection: Pick<CredentialCollection, 'id' | 'name' | 'color'>;
}

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
    attributes: (
        Pick<Attribute, 'id' | 'name'>
        & { value: string }
    )[];
}