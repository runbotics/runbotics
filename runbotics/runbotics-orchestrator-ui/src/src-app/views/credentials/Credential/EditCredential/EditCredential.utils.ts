import { translate } from '#src-app/hooks/useTranslations';

import { CreateCredentialDto } from '../Credential.types';

interface credentialFormValidationState {
    edited: boolean;
    name: boolean;
    collectionId: boolean;
    templateId: boolean;
}

export enum InputErrorType {
    NAME_IS_REQUIRED = 'NAME_IS_REQUIRED',
    COLLECTION_IS_REQUIRED = 'COLLECTION_IS_REQUIRED',
    TEMPLATE_IS_REQUIRED = 'TEMPLATE_IS_REQUIRED'
}

export const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_IS_REQUIRED]: translate('Credential.Add.Form.Error.NameIsRequired'),
    [InputErrorType.COLLECTION_IS_REQUIRED]: translate('Credential.Add.Form.Error.CollectionIsRequired'),
    [InputErrorType.TEMPLATE_IS_REQUIRED]: translate('Credential.Add.Form.Error.TemplateIsRequired')
};

export const getInitialFormValidationState = (collectionId: string): credentialFormValidationState => ({
    edited: false,
    name: false,
    collectionId: collectionId ? true : false,
    templateId: false
});

export const getInitialCredentialData = (collectionId: string): CreateCredentialDto => ({
    name: '',
    description: '',
    collectionId: collectionId ? collectionId : '',
    templateId: ''
});

export const isCreatedNow = (dateString: string): boolean => {
    const inputDate = new Date(dateString);
    const now = new Date();
    const timeDifference = now.getTime() - inputDate.getTime();

    return timeDifference <= 60 * 1000 && timeDifference >= 0;
};
