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
    collectionId?: string; 
    description?: string;
}

export interface EditCredentialDto {
    name: string;
    description?: string
}

