import { translate } from '#src-app/hooks/useTranslations';

import { CreateCredentialDto } from '../Credential.types';

export interface CredentialFormValidationState {
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

export const getInitialFormValidationState = (collectionId: string): CredentialFormValidationState => ({
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
    const ONE_MIN_MLS = 60 * 1000;
    const inputDate = new Date(dateString);
    const now = new Date();
    const timeDifference = now.getTime() - inputDate.getTime();
    const createdInPastMinute = timeDifference <= ONE_MIN_MLS && timeDifference >= 0;

    return createdInPastMinute;
};
