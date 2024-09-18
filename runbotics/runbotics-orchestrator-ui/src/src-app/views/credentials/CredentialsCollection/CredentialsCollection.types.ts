import { User } from '#src-app/types/user';

import { ColorNames } from './EditCredentialsCollection/CollectionColor/CollectionColor.utils';
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
    color: ColorNames;
    createdAt: string;
    createdById: number;
    updatedAt: string;
    updatedById: number;
    accessType: AccessType;
    description?: string;
    credentialCollectionUser?: CredentialsCollectionUser[];
    credentials: BasicCredentialDto[]
    createdBy: User
}

export interface CredentialsCollectionUser {
    id: string;
    userId: number;
    credentialCollectionId: string;
    accessType: AccessType;
    privilegeType: PrivilegeType;
    user: User;
}

export interface EditCredentialsCollectionDto {
    id?: string;
    name: string;
    accessType: AccessType;
    color: ColorNames;
    sharedWith?: {
        email: string;
        privilegeType: PrivilegeType
    }[]
    description?: string;
}

export type CredentialsCollectionKeys = { [Key in keyof BasicCredentialsCollectionDto]: Key }[keyof BasicCredentialsCollectionDto];

export type CredenitalsCollectionValues = BasicCredentialsCollectionDto[CredentialsCollectionKeys];
