import React, { FC, useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { Dialog, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { UserDto } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch, { UserSearchType } from '#src-app/hooks/useUserSearch';
import { useDispatch, useSelector } from '#src-app/store';
import { usersSelector, usersActions } from '#src-app/store/slices/Users';
import englishEditListTranslations from '#src-app/translations/en/users/list/edit';
import { Form, Title, Content } from '#src-app/views/utils/FormDialog.styles';

import { StyledButton, DeleteButton, StyledDialogActions } from './UsersListEdit.styles';
import { FormValidationState, UsersListEditDialogProps } from './UsersListEdit.types';
import { getUserDataWithoutNulls, getUserDataWithoutEmptyStrings, initialValidationState } from './UsersListEdit.utils';
import UsersListEditForm from './UsersListEditForm';
import DeleteUserDialog from '../../DeleteUserDialog';

const UsersListEditDialog: FC<UsersListEditDialogProps> = ({
    open,
    onClose,
    userData,
    isForAdmin
}) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const searchType = isForAdmin ? UserSearchType.ALL_ACTIVATED : UserSearchType.TENANT_ACTIVATED;
    const { refreshSearch: refreshSearchActivated } = useUserSearch({ searchType });
    const { activated } = useSelector(usersSelector);

    const [user, setUser] = useState<UserDto>(userData);
    const [formValidationState, setFormValidationState] = useState<FormValidationState>(initialValidationState);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

    const handleOpenDeleteDialog = () => {
        setIsDeleteDialogVisible(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogVisible(false);
    };

    useEffect(() => {
        setUser(getUserDataWithoutNulls(userData));
    }, [userData]);

    const checkFormFieldsValidation = () => formValidationState &&formValidationState.email;

    const handleSave = (): void => {
        if (!checkFormFieldsValidation()) return;

        const dataPayload = getUserDataWithoutEmptyStrings(user);
        dispatch(usersActions.updateInTenant({ payload: dataPayload, resourceId: dataPayload.id }))
            .unwrap()
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
        <>
            <If condition={isForAdmin}>
                <DeleteUserDialog
                    open={isDeleteDialogVisible}
                    onClose={handleCloseDeleteDialog}
                    onDelete={handleClose}
                    getSelectedUsers={() => [user]}
                />
            </If>
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
                        <Box>
                            <If condition={isForAdmin}>
                                <DeleteButton
                                    onClick={handleOpenDeleteDialog}
                                    variant='contained'
                                    loading={activated.loading}
                                >
                                    {translate('Users.List.Edit.Form.Button.Delete')}
                                </DeleteButton>
                            </If>
                        </Box>
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
        </>
    );
};

export default UsersListEditDialog;
