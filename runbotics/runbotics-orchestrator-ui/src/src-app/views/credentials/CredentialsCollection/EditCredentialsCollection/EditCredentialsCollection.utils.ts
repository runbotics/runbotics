import { AccessType, DEFAULT_COLLECTION_COLOR, FrontCredentialCollectionDto, Role, UserDto } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { SharedWithUser } from './SharedWithUsers/SharedWithUsers';
import { EditCredentialsCollectionDto, EditCredentialsCollectionWithCreatorDto } from '../CredentialsCollection.types';

export enum InputErrorType {
    NAME_IS_REQUIRED = 'NAME_IS_REQUIRED'
}

export const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_IS_REQUIRED]: translate('Credentials.Collection.Add.Form.Error.NameIsRequired')
};

export interface CollectionFormValidation {
    edited: boolean;
    name: boolean
}

export const initialFormValidationState: CollectionFormValidation = {
    edited: false,
    name: false
};

export const initialCredentialsCollectionData: EditCredentialsCollectionWithCreatorDto = {
    name: '',
    accessType: AccessType.PRIVATE,
    description: '',
    color: DEFAULT_COLLECTION_COLOR,
    createdById: null,
};

export const getInitialCredentialsCollectionData = (collection: null | EditCredentialsCollectionWithCreatorDto): EditCredentialsCollectionWithCreatorDto => {
    if (!collection) {
        return initialCredentialsCollectionData;
    }

    return {
        name: collection.name,
        accessType: collection.accessType,
        color: collection.color,
        sharedWith: collection.sharedWith,
        description: collection.description,
        createdById: collection.createdById,
    };
};

export const mapToEditCredentialCollectionDto = (collection: FrontCredentialCollectionDto): EditCredentialsCollectionWithCreatorDto => {
    const sharedWithUsers = collection.credentialCollectionUser
        ? [...collection.credentialCollectionUser]
            .filter(credentialUser => credentialUser.userId !== collection.createdById)
            .map(filteredUser => ({
                email: filteredUser.user.email,
                privilegeType: filteredUser.privilegeType
            }))
        : [];

    return {
        name: collection.name,
        accessType: collection.accessType,
        color: collection.color,
        sharedWith: sharedWithUsers,
        description: collection.description ?? '',
        createdById: collection.createdById,
    };
};

export const adjustShareWithProperty = (collection: EditCredentialsCollectionWithCreatorDto): EditCredentialsCollectionDto => ({
    name: collection.name,
    accessType: collection.accessType,
    color: collection.color,
    description: collection.description ? collection.description : '',
    ...(collection.sharedWith.length > 0 && { sharedWith: collection.sharedWith })
});

interface filterOptions {
    sharedWithUsers: SharedWithUser[];
    selectedUsers: SharedWithUser[];
    collectionCreatorId: number;
    currentUserId: number;
}

const SHARE_NOT_ALLOWED_ROLES = [Role.ROLE_GUEST, Role.ROLE_TENANT_ADMIN];

export const filterSharableUsers = (
    value: string,
    allSharableUsers: UserDto[],
    {
        sharedWithUsers = [],
        selectedUsers = [],
        collectionCreatorId,
        currentUserId,
    }: filterOptions
): UserDto[] =>
    allSharableUsers.filter(
        (sharableUser) =>
            sharableUser.email.toLowerCase().includes(value.toLowerCase()) &&
            sharableUser.id !== collectionCreatorId &&
            sharableUser.id !== currentUserId &&
            !sharableUser.roles.some((role) =>
                SHARE_NOT_ALLOWED_ROLES.includes(role)
            ) &&
            !sharedWithUsers?.some(
                (sharedWithUser) => sharedWithUser.email === sharableUser.email
            ) &&
            !selectedUsers?.some(
                (selectedUser) => selectedUser.email === sharableUser.email
            )
    );
