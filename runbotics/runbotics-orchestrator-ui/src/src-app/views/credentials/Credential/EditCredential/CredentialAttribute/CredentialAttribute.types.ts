export interface BasicAttributeDto {
    id: string,
    name: string;
    masked: boolean;
    value: string;
    credentialId: string,
    // tenantId: string;
    createdOn: string;
    createdBy: string;
    modifiedOn?: string;
    modifiedBy?: string;
    description?: string;
}

export interface CreateAttributeDto {
    name: string;
    masked: boolean;
    value: string;
    credentialId: string,
    // tenantId: string;
    description?: string;
}

export interface EditAtributeDto {
    id: string;
    name: string;
    masked: boolean;
    value: string;
    description?: string;
}

export interface DisplayAttribute {
    id: string,
    name: string,
    description?: string,
    required?: boolean,
    templateId?: string,
    value?: string,
    type?: CredentialTemplateAttributeType
}

export interface CredentialTemplateAttribute extends EditAtributeDto {
    id: string,
    name: string,
    description?: string,
    required: boolean,
    templateId: string,
    type: CredentialTemplateAttributeType
}

export enum CredentialTemplateAttributeType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
}

export interface UnmaskedAttribute extends BasicAttributeDto {
    masked: false;
    value: string;
}

export interface MaskedAttribute extends BasicAttributeDto {
    masked: true;
}

export type Attribute = UnmaskedAttribute | MaskedAttribute

export const initialCredentialAttributeValues: CreateAttributeDto = {
    name: '',
    value: '',
    description: '',
    masked: true,
    credentialId: ''
};

export function isTemplateAttribute(obj: CredentialTemplateAttribute | EditAtributeDto): obj is CredentialTemplateAttribute {
    return (obj as CredentialTemplateAttribute).required !== undefined;
}
