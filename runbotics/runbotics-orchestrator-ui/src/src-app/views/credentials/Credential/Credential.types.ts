import { Credential, CredentialCollection, CredentialTemplate, Attribute } from 'runbotics-common';

export interface FrontCredentialDto
    extends Pick<
        Credential,
        'id' | 'name' | 'collectionId' | 'templateId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'description'
    > {
    attributes: Attribute[];
    template: Omit<CredentialTemplate, 'description'>;
    collection: Pick<CredentialCollection, 'id' | 'name' | 'color'>;
}

export interface CreateCredentialDto {
    name: string;
    templateId: string;
    collectionId?: string;
    description?: string;
}

export interface EditCredentialDto {
    name: string;
    description?: string;
}
