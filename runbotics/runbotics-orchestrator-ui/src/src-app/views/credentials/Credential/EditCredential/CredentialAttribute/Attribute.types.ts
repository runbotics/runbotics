import { Attribute } from 'runbotics-common';

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

export interface UnmaskedAttribute extends Attribute {
    masked: false;
    value: string;
}

export interface MaskedAttribute extends Attribute {
    masked: true;
}

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

export type FrontAttribute = UnmaskedAttribute | MaskedAttribute;
