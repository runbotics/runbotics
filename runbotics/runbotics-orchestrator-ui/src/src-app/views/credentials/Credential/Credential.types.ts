import { Attribute } from './EditCredential/CredentialAttribute/CredentialAttribute.types';
import { CollectionColorName } from '../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

export enum CredentialTemplate {
    CUSTOM = 'CUSTOM'
}

export interface Credential {
    id?: string,
    name: string,
    description: string,
    collectionName: string,
    collectionColor: CollectionColorName,
    attributes?: Attribute[];
    template?: CredentialTemplate;
    tenantId?: string;
    // createdOn: Date;
    // createdBy: User; // userId
    // modifiedOn: Date;
    // modifiedBy: User; // userId
}

