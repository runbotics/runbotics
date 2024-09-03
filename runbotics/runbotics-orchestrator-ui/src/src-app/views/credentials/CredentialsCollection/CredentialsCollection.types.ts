import { User } from '#src-app/types/user';

import { CollectionColorName } from './EditCredentialsCollection/CollectionColor/CollectionColor.types';
import { BasicCredentialDto } from '../Credential/Credential.types';

export enum AccessType { 
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP'
}

export enum PrivilegeType {
    READ = 'READ',
    WRITE = 'WRITE',
}

export interface BasicCredentialsCollectionDto {
    id: string;
    name: string;
    tenantId: string;
    color: CollectionColorName;
    createdAt: string;
    createdById: string;
    updatedAt: string;
    updatedById: string;
    accessType: AccessType;
    description?: string;
    credentialCollectionUser?: CredentialsCollectionUser[];
    credentials: BasicCredentialDto[]
    createdBy: User
}

export interface CredentialsCollectionUser {
    id: string;
    userId: string;
    credentialCollectionId: string;
    accessType: AccessType;
    privilegeType: PrivilegeType;
    user: User;
}

export interface EditCredentialsCollectionDto {
    id?: string;
    name: string;
    accessType: AccessType;
    color: CollectionColorName;
    sharedWith: {
        email: string;
        privilegeType: PrivilegeType
    }[]
    description?: string;
}

export type CredentialsCollectionKeys = { [Key in keyof BasicCredentialsCollectionDto]: Key }[keyof BasicCredentialsCollectionDto];

export type CredenitalsCollectionValues = BasicCredentialsCollectionDto[CredentialsCollectionKeys];
