
import { translate } from '#src-app/hooks/useTranslations';

import { CreateCredentialsCollectionDto, EditCredentialsCollectionDto } from '../CredentialsCollection.types';

export const DEFAULT_COLLECTION_COLOR = 'DARK_ORANGE';

export enum InputErrorType {
    NAME_NOT_AVAILABLE = 'NAME_NOT_AVAILABLE',
    NAME_IS_REQUIRED = 'NAME_IS_REQUIRED',
}

export const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_NOT_AVAILABLE]: translate('Credentials.Collection.Add.Form.Error.NameNotAvailable'),
    [InputErrorType.NAME_IS_REQUIRED]: translate('Credentials.Collection.Add.Form.Error.NameIsRequired'),
};

export const initialFormValidationState = true;

const initialCredentialsCollectionData: CreateCredentialsCollectionDto = {
    name: '',
    description: '',
    color: DEFAULT_COLLECTION_COLOR,
    tenantId: '', // to update
    users: [],
    isPrivate: true,
};

export const getInitialCredentialsCollectionData = (collection: null | EditCredentialsCollectionDto): CreateCredentialsCollectionDto | EditCredentialsCollectionDto => {
    if (!collection) {
        return initialCredentialsCollectionData;
    }

    const editCredentialInitialData: EditCredentialsCollectionDto = {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        color: collection.color,
        isPrivate: collection.isPrivate,
        users: collection.users
    };

    return editCredentialInitialData;

};
