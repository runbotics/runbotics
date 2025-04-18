import { Credential, FrontCredentialDto } from './credential.model';
import { Tenant } from './tenant.model';
import { BasicUserDto } from './user.model';

export enum AccessType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP',
}

export enum PrivilegeType {
    READ = 'READ',
    WRITE = 'WRITE',
}

export enum Color {
    LIGHT_ORANGE = 'LIGHT_ORANGE',
    DARK_ORANGE = 'DARK_ORANGE',
    LIGHT_GREEN = 'LIGHT_GREEN',
    DARK_GREEN = 'DARK_GREEN',
    LIGHT_BLUE = 'LIGHT_BLUE',
    DARK_BLUE = 'DARK_BLUE',
    LIGHT_GREY = 'LIGHT_GREY',
    DARK_GREY = 'DARK_GREY',
}

export const DEFAULT_COLLECTION_COLOR = Color.DARK_ORANGE;

export type ColorNames = keyof typeof Color;

export interface CredentialCollectionUser {
    id: string;
    userId: number;
    credentialCollectionId: string;
    accessType: AccessType;
    privilegeType: PrivilegeType;
    user: BasicUserDto;
}

export interface CredentialCollection {
    id: string;
    name: string;
    tenantId: string;
    tenant: Tenant;
    description?: string;
    createdBy: BasicUserDto;
    createdById: number;
    updatedBy: BasicUserDto;
    updatedById: number;
    credentials: Credential[];
    color: ColorNames;
    accessType: AccessType;
    createdAt: string;
    updatedAt: string;
    credentialCollectionUser: CredentialCollectionUser[]
}

export interface FrontCredentialCollectionDto
    extends Pick<
        CredentialCollection,
        'id' |
        'name' |
        'tenantId' |
        'description' |
        'createdBy' |
        'createdById' |
        'color' |
        'accessType' |
        'createdAt' |
        'updatedAt'
    > {
    credentialCollectionUser?: CredentialCollectionUser[];
    credentials: FrontCredentialDto[];
}