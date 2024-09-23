
export interface BasicAttributeDto {
    id: string;
  name: string;
  tenantId: string;
  masked: boolean;
  secretId: string;
  description?: string;
  credentialId: string;
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

export interface UnmaskedAttribute extends BasicAttributeDto {
    masked: false;
    value: string;
}

export interface MaskedAttribute extends BasicAttributeDto {
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

export type Attribute = UnmaskedAttribute | MaskedAttribute;
