import { IUser } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { SharedWithUser } from './SharedWithUsers/SharedWithUsers';
import { AccessType, BasicCredentialsCollectionDto, EditCredentialsCollectionDto } from '../CredentialsCollection.types';

export const DEFAULT_COLLECTION_COLOR = 'DARK_ORANGE';

export enum InputErrorType {
    NAME_IS_REQUIRED = 'NAME_IS_REQUIRED'
}

export const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_IS_REQUIRED]: translate('Credentials.Collection.Add.Form.Error.NameIsRequired')
};

export const initialFormValidationState = true;

export const initialCredentialsCollectionData: EditCredentialsCollectionDto = {
    name: '',
    accessType: AccessType.PRIVATE,
    description: '',
    color: DEFAULT_COLLECTION_COLOR
};

export const getInitialCredentialsCollectionData = (collection: null | EditCredentialsCollectionDto): EditCredentialsCollectionDto => {
    if (!collection) {
        return initialCredentialsCollectionData;
    }

    return {
        name: collection.name,
        accessType: collection.accessType,
        color: collection.color,
        sharedWith: collection.sharedWith,
        description: collection.description
    };
};

export const mapToEditCredentialCollectionDto = (collection: BasicCredentialsCollectionDto): EditCredentialsCollectionDto => {
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
        description: collection.description ? collection.description : ''
    };
};

export const adjustShareWithProperty = (collection: EditCredentialsCollectionDto): EditCredentialsCollectionDto => ({
    name: collection.name,
    accessType: collection.accessType,
    color: collection.color,
    description: collection.description ? collection.description : '',
    ...(collection.sharedWith.length > 0 && { sharedWith: collection.sharedWith })
});

interface filterOptions {
    sharedWithUsers: SharedWithUser[];
    selectedUsers: IUser[];
    collectionCreatorId: number;
}

export const filterSharableUsers = (value: string, allSharableUsers: IUser[], {
    sharedWithUsers =[],
    selectedUsers = [],
    collectionCreatorId
}: filterOptions ): IUser[] =>
    allSharableUsers.filter(
        sharableUser =>
            sharableUser.email.toLowerCase().includes(value.toLowerCase()) &&
        sharableUser.id !== collectionCreatorId
        &&
        !sharedWithUsers?.some(sharedWithUser => sharedWithUser.email === sharableUser.email) &&
        !selectedUsers?.some(selectedUser => selectedUser.id === sharableUser.id)
    );
