import { AccessType, ColorNames, FrontCredentialCollectionDto, PrivilegeType } from 'runbotics-common';

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

export interface EditCredentialsCollectionWithCreatorDto extends EditCredentialsCollectionDto {
    createdById: number;
}

export type CredentialsCollectionKeys = { [Key in keyof FrontCredentialCollectionDto]: Key }[keyof FrontCredentialCollectionDto];

export type CredenitalsCollectionValues = FrontCredentialCollectionDto[CredentialsCollectionKeys];
