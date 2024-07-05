import { CollectionColorHex } from '../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

export enum CredentialTemplate {
    CUSTOM = 'Custom'
}

export interface CredentialTemplateAttribute {
    id: string,
    name: string,
    description: string,
    required: boolean,
    templateId: string,
    type: CredentialTemplateAttributeType

}

export enum CredentialTemplateAttributeType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
}

export interface CredentialTemplateNew {
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
    description?: string;
}

export interface EditCredentialDto {
    id: string;
    name: string;
    template: CredentialTemplate;
    description?: string
}
