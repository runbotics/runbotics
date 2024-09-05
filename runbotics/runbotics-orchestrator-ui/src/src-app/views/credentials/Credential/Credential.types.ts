

import { BasicAttributeDto } from './EditCredential/CredentialAttribute/Attribute.types';

export interface BasicCredentialDto {
    id: string;
    name: string;
    tenantId: string;
    collectionId: string;
    attributes: BasicAttributeDto[]
    templateId: string;
    createdAt: string;
    createdById: string;
    updatedAt?: string;
    updatedById?: string;
    description?: string;
}

export interface CreateCredentialDto {
    name: string;
    templateId: string;
    // TODO remove, but there is some view that requires it - check and correct
    collectionId?: string; 
    description?: string;
}

export interface EditCredentialDto {
    name: string;
    description?: string
}

export type CredentialTemplateAttributeType = 'string' | 'boolean' | 'number';

export interface CredentialTemplateAttribute {
    id: string;
    name: string;
    tenantId: string;
    masked: boolean;
    secretId: string;
    credentialId: string
    description?: string;
}

export interface CredentialTemplate {
    id: string,
    name: string,
    tenantId?: string;
    attributes: CredentialTemplateAttribute[]
    description?: string
}

