import React, { FC, ChangeEvent } from 'react';

import { TextField, MenuItem, Switch, Typography } from '@mui/material';

import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';
import { languages } from '#src-app/translations/translations';
import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';
import { emailRegex } from '#src-app/views/users/UsersListView/UsersListEdit/UsersListEdit.utils';

import { UsersListEditFormProps } from './UsersListEdit.types';

const UsersListEditForm: FC<UsersListEditFormProps> = ({
    user,
    setUser,
    formValidationState,
    setFormValidationState
}) => {
    const { translate } = useTranslations();
    const auth = useAuth();

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

    const handleActivatedSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUser((prevState) => ({ ...prevState, activated: event.target.checked }));
    };

    return (
        <>
            <TextField
                label={translate('Users.List.Edit.Form.Label.Email')}
                value={user.email}
                onChange={handleEmailFieldInput}
                error={!formValidationState.email}
                {...(!formValidationState.email && { helperText: translate('Users.List.Edit.Form.Error.Email') })}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.Login')}
                value={user.login}
                onChange={handleLoginFieldInput}
                error={!formValidationState.login}
                {...(!formValidationState.login && { helperText: translate('Users.List.Edit.Form.Error.FieldRequired') })}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.FirstName')}
                value={user.firstName}
                onChange={handleFirstNameFieldInput}
            />
            <TextField
                label={translate('Users.List.Edit.Form.Label.LastName')}
                value={user.lastName}
                onChange={handleLastNameFieldInput}
            />
            <TextField
                select
                label={translate('Users.List.Edit.Form.Label.Language')}
                value={user.langKey}
                onChange={handleLanguageFieldInput}
            >
                <MenuItem value={languages[0]}>
                    {translate('Users.List.Edit.Form.Select.Language.English')}
                </MenuItem>
                <MenuItem value={languages[1]}>
                    {translate('Users.List.Edit.Form.Select.Language.Polish')}
                </MenuItem>
            </TextField>
            <Typography>
                {translate('Users.List.Edit.Form.Switch.Activated')}
                <Switch
                    checked={user.activated}
                    onChange={handleActivatedSwitchChange}
                    disabled={user.id === auth.user.id}
                />
                <InfoButtonTooltip
                    message={translate('Users.List.Edit.Form.Switch.InfoTooltip')}
                />
            </Typography>
        </>
    );
};

export default UsersListEditForm;
