import { translate } from '#src-app/hooks/useTranslations';


import { CreateCredentialDto } from '../Credential.types';



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

export const getInitialCredentialData = (collectionId: string) => {
    const initialCredentialData: CreateCredentialDto = {
        name: '',
        description: '',
        collectionId: collectionId ? collectionId : '',
        templateId: ''
    };

    return initialCredentialData;
};
