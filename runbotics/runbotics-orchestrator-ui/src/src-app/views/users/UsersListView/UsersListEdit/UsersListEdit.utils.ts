import { UserDto } from 'runbotics-common';

import { DEFAULT_LANG } from '#src-app/translations/translations';

import { FormValidationState } from './UsersListEdit.types';

export const getUserDataWithoutNulls = (userData: UserDto) => ({
    ...userData,
    firstName: userData?.firstName ?? '',
    lastName: userData?.lastName ?? '',
    langKey: userData?.langKey ?? DEFAULT_LANG
});

export const getUserDataWithoutEmptyStrings = (userData: UserDto) => ({
    id: userData.id,
    email: userData.email,
    activated: userData.activated,
    firstName: (userData.firstName === '' ? null : userData.firstName),
    lastName: (userData.lastName === '' ? null : userData.lastName),
    langKey: userData.langKey
});

export const initialValidationState: FormValidationState = {
    email: true,
};

export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
