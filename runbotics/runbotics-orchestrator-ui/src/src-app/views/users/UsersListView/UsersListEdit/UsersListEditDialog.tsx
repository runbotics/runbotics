import React, { FC, useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { Dialog, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { IUser } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch from '#src-app/hooks/useUserSearch';
import { useDispatch, useSelector } from '#src-app/store';
import { usersSelector, usersActions } from '#src-app/store/slices/Users';
import { Form, Title, Content } from '#src-app/views/utils/FormDialog.styles';

import { StyledButton, DeleteButton, StyledDialogActions } from './UsersListEdit.styles';
import { UserDataValidation, UsersListEditDialogProps } from './UsersListEdit.types';
import { getUserDataWithoutNulls, getUserDataWithoutEmptyStrings, initialValidationState } from './UsersListEdit.utils';
import UsersListEditForm from './UsersListEditForm';

const UsersListEditDialog: FC<UsersListEditDialogProps> = ({
    open,
    openDeleteTab,
    onClose,
    userData
}) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const { refreshSearchActivated } = useUserSearch(true);
    const { activated } = useSelector(usersSelector);
    const [user, setUser] = useState<IUser>(userData);
    const [validation, setValidation] = useState<UserDataValidation>(initialValidationState);

    useEffect(() => setUser(getUserDataWithoutNulls(userData)), [userData]);

    const validateForm = () => {
        if (!validation.email) return true;
        if (!validation.login) return true;
        return false;
    };

    const handleSave = () => {
        if (validateForm()) return;

        const payload: IUser = getUserDataWithoutEmptyStrings(user);
        dispatch(usersActions.updateActivated(payload))
            .then(() => {
                handleClose();
                enqueueSnackbar(
                    translate('Users.List.Edit.Form.Event.Success'),
                    { variant: 'success' }
                );
                refreshSearchActivated();
            })
            .catch((response) => {
                handleClose();
                enqueueSnackbar(response.title, { variant: 'error' });
            });
    };

    const handleClose = () => {
        setValidation(initialValidationState);
        onClose();
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="md"
        >
            <Title>
                {translate('Users.List.Edit.Form.Title')}
            </Title>
            <Content>
                <Form>
                    <UsersListEditForm
                        user={user}
                        setUser={setUser}
                        validation={validation}
                        setValidation={setValidation}
                    />
                </Form>
            </Content>
            <StyledDialogActions>
                <DeleteButton
                    onClick={openDeleteTab}
                    variant='contained'
                    loading={activated.loading}
                >
                    {translate('Users.List.Edit.Form.Button.Delete')}
                </DeleteButton>
                <Box>
                    <StyledButton
                        onClick={handleClose}
                        disabled={activated.loading}
                    >
                        {translate('Users.List.Edit.Form.Button.Cancel')}
                    </StyledButton>
                    <LoadingButton
                        variant='contained'
                        onClick={handleSave}
                        loading={activated.loading}
                    >
                        {translate('Users.List.Edit.Form.Button.Save')}
                    </LoadingButton>
                </Box>
            </StyledDialogActions>
        </Dialog>
    );
};

export default UsersListEditDialog;
