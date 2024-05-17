export interface BasicAttributeDto {
    id: string,
    name: string;
    masked: boolean;
    value: string;
    credentialId: string,
    tenantId: string;
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
    tenantId: string;
    description?: string;
}

export interface EditAtributeDto {
    name: string;
    masked: string;
    value: string;
    description?: string;
}

export interface UnmaskedAttribute extends BasicAttributeDto {
    masked: false;
    value: string;
}

export interface MaskedAttribute extends BasicAttributeDto {
    masked: true;
}

export type Attribute = UnmaskedAttribute | MaskedAttribute;
