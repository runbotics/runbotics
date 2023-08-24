import React, { FC, useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { Dialog, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { IUser } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch from '#src-app/hooks/useUserSearch';
import { useDispatch, useSelector } from '#src-app/store';
import { usersSelector, usersActions } from '#src-app/store/slices/Users';
import englishEditListTranslations from '#src-app/translations/en/users/list/edit';
import { Form, Title, Content } from '#src-app/views/utils/FormDialog.styles';

import { StyledButton, DeleteButton, StyledDialogActions } from './UsersListEdit.styles';
import { IFormValidationState, UsersListEditDialogProps } from './UsersListEdit.types';
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

    const { refreshSearch: refreshSearchActivated } = useUserSearch(true);
    const { activated } = useSelector(usersSelector);
    const [user, setUser] = useState<IUser>();
    const [formValidationState, setFormValidationState] = useState<IFormValidationState>(initialValidationState);

    useEffect(() => setUser(getUserDataWithoutNulls(userData)), [userData]);

    const checkFormFieldsValidation = () => {
        if (!formValidationState.email) return false;
        if (!formValidationState.login) return false;
        return true;
    };

    const handleSave = (): void => {
        if (!checkFormFieldsValidation()) return;

        const dataPayload: IUser = getUserDataWithoutEmptyStrings(user);
        dispatch(usersActions.updateActivated(dataPayload)).unwrap()
            .then(() => {
                handleClose();
                enqueueSnackbar(
                    translate('Users.List.Edit.Form.Event.Success'),
                    { variant: 'success' }
                );
                refreshSearchActivated();
            })
            .catch(({ errorKey }) => {
                handleClose();
                enqueueSnackbar(
                    translate(
                        `Users.List.Edit.Form.Event.Error.${errorKey}` as keyof typeof englishEditListTranslations
                    ),
                    { variant: 'error' }
                );
            });
    };

    const handleClose = (): void => {
        onClose();
        setFormValidationState(initialValidationState);
        setUser(getUserDataWithoutNulls(userData));
    };

    return (
        <If condition={open}>
            <Dialog open>
                <Title>
                    {translate('Users.List.Edit.Form.Title')}
                </Title>
                <Content>
                    <Form>
                        <UsersListEditForm
                            user={user}
                            setUser={setUser}
                            formValidationState={formValidationState}
                            setFormValidationState={setFormValidationState}
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
                            disabled={!checkFormFieldsValidation()}
                        >
                            {translate('Users.List.Edit.Form.Button.Save')}
                        </LoadingButton>
                    </Box>
                </StyledDialogActions>
            </Dialog>
        </If>
    );
};

export default UsersListEditDialog;
