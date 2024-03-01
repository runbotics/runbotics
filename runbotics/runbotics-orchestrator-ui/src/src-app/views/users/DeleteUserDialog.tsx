import React, { FC, useEffect, useState } from 'react';

import {
    Typography,
    List,
    ListItem,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { IUser } from 'runbotics-common';
import styled from 'styled-components';

import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch from '#src-app/hooks/useUserSearch';
import { usersActions, usersSelector } from '#src-app/store/slices/Users';

const StyledList = styled(List)`
    max-height: 200px;
    overflow: auto;
    && {
        list-style-type: disc;
        list-style-position: inside;
    }
`;

interface DeleteUserDialogProps {
    open?: boolean;
    onClose: () => void;
    onDelete?: () => void;
    getSelectedUsers: () => IUser[];
}

const DeleteUserDialog: FC<DeleteUserDialogProps> = ({
    open,
    onClose,
    onDelete,
    getSelectedUsers
}) => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const { userDelete } = useSelector(usersSelector);
    const { refreshSearch: refreshSearchNotActivated } = useUserSearch();
    const { refreshSearch: refreshSearchActivated } = useUserSearch({ isActivatedUsersOnly: true });
    const [usersData, setUsersData] = useState<IUser[]>([]);

    const handleSubmit = () => {
        Promise
            .allSettled(
                usersData.map((user) =>
                    dispatch(usersActions.deleteUser({ userId: user.id }))
                )
            )
            .then(() => {
                onClose();
                onDelete?.();
                enqueueSnackbar(
                    translate('Users.Actions.Modals.DeleteModal.Success'),
                    { variant: 'success' }
                );

                usersData[0].activated
                    ? refreshSearchActivated()
                    : refreshSearchNotActivated();
            })
            .catch(() => {
                onClose();
                onDelete?.();
                enqueueSnackbar(
                    translate('Users.Actions.Modals.DeleteModal.Error'),
                    { variant: 'error' }
                );
            });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { open && setUsersData(getSelectedUsers); }, [open]);

    return (
        <CustomDialog
            isOpen={open}
            onClose={onClose}
            title={translate('Users.Actions.Modals.DeleteModal.TitleMessage')}
            confirmButtonOprions={{
                label: translate('Users.Actions.Modals.DeleteModal.Button.Delete'),
                onClick: handleSubmit,
                isLoading: userDelete.loading,
            }}
            cancelButtonOptions={{
                label: translate('Users.Actions.Modals.DeleteModal.Button.Cancel'),
                onClick: onClose,
                isDisabled: userDelete.loading,
            }}
        >
            <StyledList>
                {usersData.map((user) => (
                    <Typography key={user.id}>
                        <ListItem sx={{ display: 'list-item' }}>
                            {user.email}
                        </ListItem>
                    </Typography>
                ))}
            </StyledList>
        </CustomDialog>
    );
};


export default DeleteUserDialog;
