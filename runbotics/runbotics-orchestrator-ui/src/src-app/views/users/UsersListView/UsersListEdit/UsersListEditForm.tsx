import React, { FC, ChangeEvent } from 'react';

import { TextField, MenuItem } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';
import { requiredFieldValidator } from '#src-app/views/users/UsersListView/UsersListEdit/UsersListEdit.utils';

import { UsersListEditFormProps } from './UsersListEdit.types';

const UsersListEditForm: FC<UsersListEditFormProps> = ({
    user,
    setUser,
    validation,
    setValidation
}) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

    const { translate } = useTranslations();

    const getEmailValidator = () => !(validation.email) && requiredFieldValidator; // +add regex pattern with [a-zA-Z0-9.]@[A-Z0-9.].[a-zA-Z]

    const getLoginValidator = () => !(validation.login) && requiredFieldValidator;

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        setUser((prevState) => ({ ...prevState, email }));
        setValidation((prevState) => ({
            ...prevState,
            email: (email.trim() !== '') && emailRegex.test(email)
        }));
    };

    const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
        const login = event.target.value;
        setUser((prevState) => ({ ...prevState, login }));
        setValidation((prevState) => ({ ...prevState, login: (login.trim() !== '' ) }));
    };

    const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUser((prevState) => ({ ...prevState, firstName: event.target.value}));
    };

    const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUser((prevState) => ({ ...prevState, lastName: event.target.value }));
    };

    const handleLanguageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUser((prevState) => ({ ...prevState, langKey: event.target.value }));
    };

    return (
        <>
            <TextField
                label={translate('Users.List.Edit.Form.Label.Email')}
                value={user.email}
                onChange={handleEmailChange}
                {...getEmailValidator()}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.Login')}
                value={user.login}
                onChange={handleLoginChange}
                {...getLoginValidator()}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.FirstName')}
                value={user.firstName}
                onChange={handleFirstNameChange}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.LastName')}
                value={user.lastName}
                onChange={handleLastNameChange}
            />
            <TextField
                select
                label={translate('Users.List.Edit.Form.Label.Language')}
                value={user.langKey}
                onChange={handleLanguageChange}
            >
                <MenuItem value='en'>
                    {translate('Users.List.Edit.Form.Select.Language.English')}
                </MenuItem>
                <MenuItem value='pl'>
                    {translate('Users.List.Edit.Form.Select.Language.Polish')}
                </MenuItem>
            </TextField>
        </>
    );
};

export default UsersListEditForm;
