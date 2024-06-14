import { CollectionColorName } from './EditCredentialsCollection/CollectionColor/CollectionColor.types';

export enum AccessType { 
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export interface BasicCredentialsCollectionDto {
    id: string;
    name: string;
    color: CollectionColorName;
    isPrivate: boolean;
    tenantId: string;
    createdOn: string;
    createdBy: string;
    modifiedOn: string;
    modifiedBy: string;
    // credentials: BasicCredentialDto[]
    description?: string;
    users?: CredentialsCollectionUser[];
}

export interface CredentialsCollectionUser {
    userId: string;
    collectionId: string;
    accessType: AccessType;
}

export interface CreateCredentialsCollectionDto {
    name: string;
    color: CollectionColorName;
    tenantId: string;
    // credentials: BasicCredentialDto[];
    isPrivate: boolean;
    description?: string;
    users?: CredentialsCollectionUser[];
}

export interface EditCredentialsCollectionDto {
    id: string;
    name: string;
    color: CollectionColorName;
    // credentials: BasicCredentialDto[];
    isPrivate: boolean;
    description?: string;
    users: CredentialsCollectionUser[];
}

export type CredentialsCollectionKeys = { [Key in keyof BasicCredentialsCollectionDto]: Key }[keyof BasicCredentialsCollectionDto];

export type CredenitalsCollectionValues = BasicCredentialsCollectionDto[CredentialsCollectionKeys];
