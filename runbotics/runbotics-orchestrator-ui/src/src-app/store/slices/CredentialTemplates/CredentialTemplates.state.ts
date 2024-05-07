
export type CredentialTemplateAttributeType = 'string' | 'boolean' | 'number';

export interface CredentialTemplateAttribute {
    id: string;
    name: string;
    required: boolean;
    type: CredentialTemplateAttributeType;
    templateId: string;
    description?: string;
}

export interface CredentialTemplate {
    id: string,
    name: string,
    tenantId?: string;
    attributes: CredentialTemplateAttribute[]
    description?: string
}

export interface CredentialTemplatesState {
    data: CredentialTemplate[];
    loading: boolean;
}
