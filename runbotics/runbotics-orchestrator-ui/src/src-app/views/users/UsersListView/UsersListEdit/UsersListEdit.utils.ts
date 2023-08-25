import { IUser } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';
import { DEFAULT_LANG } from '#src-app/translations/translations';

import { FieldValidation, FormValidationState } from './UsersListEdit.types';

export const getUserDataWithoutNulls = (userData: IUser) => ({
    ...userData,
    firstName: userData?.firstName ?? '',
    lastName: userData?.lastName ?? '',
    langKey: userData?.langKey ?? DEFAULT_LANG
});

export const getUserDataWithoutEmptyStrings = (userData: IUser) => ({
    id: userData.id,
    email: userData.email,
    login: userData.login,
    firstName: (userData.firstName === '' ? null : userData.firstName),
    lastName: (userData.lastName === '' ? null : userData.lastName),
    langKey: userData.langKey
});

export const initialValidationState: FormValidationState = {
    email: true,
    login: true
};

export const requiredFieldValidation: FieldValidation = {
    error: true,
    helperText: translate('Users.List.Edit.Form.Error.FieldRequired')
};

export const emailFieldValidation: FieldValidation = {
    error: true,
    helperText: translate('Users.List.Edit.Form.Error.Email')
};

export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
