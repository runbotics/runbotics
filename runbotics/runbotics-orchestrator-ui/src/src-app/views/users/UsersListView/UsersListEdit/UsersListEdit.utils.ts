import { IUser } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ValidatorType, UserDataValidation } from './UsersListEdit.types';

export const getUserDataWithoutNulls = (userData: IUser) => ({
    ...userData,
    firstName: userData.firstName ?? '',
    lastName: userData.lastName ?? '',
    langKey: userData.langKey ?? 'en'
});

export const getUserDataWithoutEmptyStrings = (userData: IUser) => ({
    id: userData.id,
    email: userData.email,
    login: userData.login,
    firstName: (userData.firstName === '' ? null : userData.firstName),
    lastName: (userData.lastName === '' ? null : userData.lastName),
    langKey: userData.langKey
});

export const initialValidationState: UserDataValidation = {
    email: true,
    login: true
};

export const requiredFieldValidator: ValidatorType = {
    error: true,
    helperText: translate('Users.List.Edit.Form.Info.FieldRequired')
};

export const emailFieldValidator: ValidatorType = {
    error: true,
    helperText: translate('Users.List.Edit.Form.Info.Email')
};
