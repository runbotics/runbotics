
import { translate } from '#src-app/hooks/useTranslations';

import { CredentialsCollection } from '../CredentialsCollection.types';

export enum InputErrorType {
    NAME_NOT_AVAILABLE = 'NAME_NOT_AVAILABLE',
    NAME_IS_REQUIRED = 'NAME_IS_REQUIRED',
}

export const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_NOT_AVAILABLE]: translate('Credentials.Collection.Add.Form.Error.NameNotAvailable'),
    [InputErrorType.NAME_IS_REQUIRED]: translate('Credentials.Collection.Add.Form.Error.NameIsRequired'),
};

export const initialFormValidationState = true;

export const getInitialCredentialsCollectionData = () => {
    const initialCredentialsCollectionData: CredentialsCollection = {
        name: '',
        description: '',
        collectionColor: null,
        access: 'public', // to update
        location: 'home', // to update
        sharedWith: []
    };

    return initialCredentialsCollectionData;
};
