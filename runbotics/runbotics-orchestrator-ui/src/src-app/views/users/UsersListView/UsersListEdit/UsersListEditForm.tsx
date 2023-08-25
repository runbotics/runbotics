import React, { FC, ChangeEvent } from 'react';

import { TextField, MenuItem } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';
import { languages } from '#src-app/translations/translations';
import { emailFieldValidation, requiredFieldValidation, emailRegex } from '#src-app/views/users/UsersListView/UsersListEdit/UsersListEdit.utils';

import { FieldValidation, UsersListEditFormProps } from './UsersListEdit.types';

const UsersListEditForm: FC<UsersListEditFormProps> = ({
    user,
    setUser,
    formValidationState,
    setFormValidationState
}) => {
    const { translate } = useTranslations();

    const getEmailValidator = (): FieldValidation => !formValidationState.email && emailFieldValidation;

    const getLoginValidator = (): FieldValidation => !formValidationState.login && requiredFieldValidation;

    const handleEmailFieldInput = (event: ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        setUser((prevState) => ({ ...prevState, email }));
        setFormValidationState((prevState) => ({
            ...prevState,
            email: (email.trim() !== '') && emailRegex.test(email)
        }));
    };

    const handleLoginFieldInput = (event: ChangeEvent<HTMLInputElement>) => {
        const login = event.target.value;
        setUser((prevState) => ({ ...prevState, login }));
        setFormValidationState((prevState) => ({ ...prevState, login: (login.trim() !== '' ) }));
    };

    const handleFirstNameFieldInput = (event: ChangeEvent<HTMLInputElement>) => {
        setUser((prevState) => ({ ...prevState, firstName: event.target.value}));
    };

    const handleLastNameFieldInput = (event: ChangeEvent<HTMLInputElement>) => {
        setUser((prevState) => ({ ...prevState, lastName: event.target.value }));
    };

    const handleLanguageFieldInput = (event: ChangeEvent<HTMLInputElement>) => {
        setUser((prevState) => ({ ...prevState, langKey: event.target.value }));
    };

    return (
        <>
            <TextField
                label={translate('Users.List.Edit.Form.Label.Email')}
                value={user?.email}
                onChange={handleEmailFieldInput}
                {...getEmailValidator()}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.Login')}
                value={user?.login}
                onChange={handleLoginFieldInput}
                {...getLoginValidator()}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.FirstName')}
                value={user?.firstName}
                onChange={handleFirstNameFieldInput}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.LastName')}
                value={user?.lastName}
                onChange={handleLastNameFieldInput}
            />
            <TextField
                select
                label={translate('Users.List.Edit.Form.Label.Language')}
                value={user?.langKey}
                onChange={handleLanguageFieldInput}
            >
                <MenuItem value={languages[0]}>
                    {translate('Users.List.Edit.Form.Select.Language.English')}
                </MenuItem>
                <MenuItem value={languages[1]}>
                    {translate('Users.List.Edit.Form.Select.Language.Polish')}
                </MenuItem>
            </TextField>
        </>
    );
};

export default UsersListEditForm;
