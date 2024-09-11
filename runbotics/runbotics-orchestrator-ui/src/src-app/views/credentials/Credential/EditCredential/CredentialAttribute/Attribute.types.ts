import { IUser } from 'runbotics-common';

export interface BasicAttributeDto {
    id: string;
    name: string;
    tenantId: string;
    masked: boolean;
    type: CredentialTemplateAttributeType;
    secretId: string;
    credentialId: string;
    createdAt: string;
    createdById: string;
    tenant: {
        id: string,
        name: string;
        createdById: string;
        created: string;
        updated: string;
        lastModifiedBy: string;
    };
    createdBy?: IUser;
    updatedBy?: IUser;
    updatedAt?: string;
    updatedById?: string;
    description?: string;
}

export interface CreateAttributeDto {
    name: string;
    value: string;
    credentialId: string;
    masked?: boolean;
    description?: string;
}

export interface EditAtributeDto {
    masked: boolean;
    value: string;
}

export interface DisplayAttribute {
    id: string,
    name: string,
    description?: string,
    required?: boolean,
    templateId?: string,
    value?: string,
    type?: CredentialTemplateAttributeType;
    credentialId: string;
    masked?: boolean;
}

export interface UnmaskedAttribute extends BasicAttributeDto {
    masked: false;
    value: string;
}

export interface MaskedAttribute extends BasicAttributeDto {
    masked: true;
}

export type CredentialTemplateAttributeType = 'string' | 'boolean' | 'number';

export interface CredentialTemplateAttribute {
    id: string;
    name: string;
    description?: string;
    templateId: string;
}

export interface CredentialTemplate {
    id: string,
    name: string,
    tenantId?: string;
    attributes: CredentialTemplateAttribute[]
    description?: string
}

export type Attribute = UnmaskedAttribute | MaskedAttribute;
