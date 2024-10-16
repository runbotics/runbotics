import { AccessType, ColorNames, CredentialCollection, PrivilegeType, CredentialCollectionUser } from 'runbotics-common';

import { FrontCredentialDto } from '../Credential/Credential.types';

export interface FrontCredentialCollectionDto
    extends Pick<
        CredentialCollection,
        'id' | 'name' | 'tenantId' | 'description' | 'createdBy' | 'createdById' | 'color' | 'accessType' | 'createdAt' | 'updatedAt'
    > {
    credentialCollectionUser?: CredentialCollectionUser[];
    credentials: FrontCredentialDto[];
}

export interface EditCredentialsCollectionDto {
    id?: string;
    name: string;
    accessType: AccessType;
    color: ColorNames;
    sharedWith?: {
        email: string;
        privilegeType: PrivilegeType;
    }[];
    description?: string;
}

export type CredentialsCollectionKeys = { [Key in keyof FrontCredentialCollectionDto]: Key }[keyof FrontCredentialCollectionDto];

export type CredenitalsCollectionValues = FrontCredentialCollectionDto[CredentialsCollectionKeys];
