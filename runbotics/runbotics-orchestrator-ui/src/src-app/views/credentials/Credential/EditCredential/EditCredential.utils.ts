import { translate } from '#src-app/hooks/useTranslations';

import { DEFAULT_COLLECTION_COLOR } from '../../CredentialsCollection/EditCredentialsCollection/EditCredentialsCollection.utils';

import { CreateCredentialDto, CredentialTemplateNames } from '../Credential.types';



export enum InputErrorType {
    NAME_NOT_AVAILABLE = 'NAME_NOT_AVAILABLE',
    NAME_IS_REQUIRED = 'NAME_IS_REQUIRED',
    COLLECTION_IS_REQUIRED = 'COLLECTION_IS_REQUIRED'
}

export const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_NOT_AVAILABLE]: translate('Credential.Add.Form.Error.NameNotAvailable'),
    [InputErrorType.NAME_IS_REQUIRED]: translate('Credential.Add.Form.Error.NameIsRequired'),
    [InputErrorType.COLLECTION_IS_REQUIRED]: translate('Credential.Add.Form.Error.CollectionIsRequired')
};

export const initialFormValidationState = true;

export const getInitialCredentialData = () => {
    const initialCredentialData: CreateCredentialDto = {
        name: '',
        description: '',
        collectionId: '',
        collectionColor: DEFAULT_COLLECTION_COLOR,
        template: {
            name: CredentialTemplateNames.CUSTOM,
            id: 'custom',
            attributes: []
        },
        templateId: 'custom'
    };

    return initialCredentialData;
};