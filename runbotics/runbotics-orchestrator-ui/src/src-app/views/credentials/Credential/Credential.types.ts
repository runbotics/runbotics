
import { CredentialTemplateAttribute } from '#src-app/store/slices/CredentialTemplates';

import { BasicAttributeDto } from './EditCredential/CredentialAttribute/Attribute.types';
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
    // template: CredentialTemplate;
    templateId: string;
    description?: string;
    tenantId?: string;
    createdAt: string;
    createdById: string;
    updatedAt?: string;
    updatedById?: string;
    attributes: BasicAttributeDto[]
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
    collectionName: string,
    collectionColor: CollectionColorHex,
    attributes?: Attribute[];
    tenantId?: string;
    // createdOn: Date;
    // createdBy: User; // userId
    // modifiedOn: Date;
    // modifiedBy: User; // userId
}