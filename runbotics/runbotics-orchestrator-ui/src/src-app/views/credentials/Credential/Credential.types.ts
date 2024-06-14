import { CollectionColorHex } from '../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

export enum CredentialTemplate {
    CUSTOM = 'CUSTOM'
}

export interface BasicCredentialDto {
    id: string;
    name: string;
    collectionId: string;
    collectionColor: CollectionColorHex,
    // attributes?: Attribute[];
    template: CredentialTemplate;
    description?: string;
    // tenantId?: string;
    createdOn: string;
    createdBy: string;
    modifiedOn?: string;
    modifiedBy?: string;
}

export interface CreateCredentialDto {
    name: string;
    collectionId: string;
    collectionColor: CollectionColorHex,
    // attributes?: Attribute[];
    template: CredentialTemplate;
    description?: string;
}

export interface EditCredentialDto {
    name: string;
    template: CredentialTemplate;
    description?: string
}
