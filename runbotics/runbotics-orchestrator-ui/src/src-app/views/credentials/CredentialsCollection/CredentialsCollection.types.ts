import { CollectionColorName } from './EditCredentialsCollection/CollectionColor/CollectionColor.types';

enum AccessType { 
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface BasicCredentialsCollectionDto {
    id: string;
    name: string;
    description: string;
    color: CollectionColorName;
    tenantId: string;
    createdOn: string;
    createdBy: string;
    modifiedOn: string;
    modifiedBy: string;
    users: CredentialsCollectionUser[];
}

export interface CredentialsCollectionUser {
    userId: string;
    collectionId: string;
    accessType: AccessType;
}

export interface CreateCredentialsCollectionDto {
    name: string;
    description: string;
    color: CollectionColorName;
    tenantId: string;
    users?: CredentialsCollectionUser[];
}

export interface EditCredentialsCollectionDto {
    name: string;
    description: string;
    color: CollectionColorName;
    users: CredentialsCollectionUser[];
}

