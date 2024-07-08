import { CredentialTemplateAttribute } from './EditCredential/CredentialAttribute/CredentialAttribute.types';
import { CollectionColorHex } from '../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

export enum CredentialTemplateNames {
    CUSTOM = 'Custom'
}

export interface CredentialTemplate {
    id: string,
    name: string,
    tenantId?: string,
    desciprion?: string,
    attributes: CredentialTemplateAttribute[]
}

export interface BasicCredentialDto {
    id: string;
    name: string;
    collectionId: string;
    collectionColor: CollectionColorHex,
    // attributes?: Attribute[];
    template: CredentialTemplate;
    templateId: string;
    description?: string;
    tenantId?: string;
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
    templateId: string;
    description?: string;
}

export interface EditCredentialDto {
    id: string;
    name: string;
    template: CredentialTemplate;
    description?: string
}
