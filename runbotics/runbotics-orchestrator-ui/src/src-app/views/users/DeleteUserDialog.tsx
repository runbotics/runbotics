import React, { FC, useEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Typography,
    List,
    ListItem,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { IUser } from 'runbotics-common';
import styled from 'styled-components';

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

const StyledButton = styled(Button)`
    width: 80px;
    height: 40px;
`;

interface DeleteUserDialogProps {
    open?: boolean;
    onClose: () => void;
    getSelectedUsers: () => IUser[];
}

const DeleteUserDialog: FC<DeleteUserDialogProps> = ({
    open,
    onClose,
    getSelectedUsers
}) => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const { userDelete } = useSelector(usersSelector);
    const { refreshSearch } = useUserSearch(false);
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
                enqueueSnackbar(translate('Users.Actions.Modals.DeleteModal.Success'), { variant: 'success' });
                refreshSearch();
            })
            .catch(() => {
                onClose();
                enqueueSnackbar(translate('Users.Actions.Modals.DeleteModal.Error'), { variant: 'error' });
            });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { open && setUsersData(getSelectedUsers); }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            onClick={(e) => e.stopPropagation()}
            fullWidth
            maxWidth="md"
        >
            <DialogContent>
                <Typography variant='h4'>
                    {translate('Users.Actions.Modals.DeleteModal.TitleMessage')}
                </Typography>
                <StyledList>
                    {usersData.map((user) => (
                        <Typography key={user.id}>
                            <ListItem sx={{ display: 'list-item' }}>
                                {user.email}
                            </ListItem>
                        </Typography>
                    ))}
                </StyledList>
            </DialogContent>
            <DialogActions>
                <StyledButton
                    color='primary'
                    onClick={onClose}
                    disabled={userDelete.loading}
                >
                    {translate('Users.Actions.Modals.DeleteModal.Button.Cancel')}
                </StyledButton>
                <LoadingButton
                    variant='contained'
                    loading={userDelete.loading}
                    onClick={handleSubmit}
                >
                    {translate('Users.Actions.Modals.DeleteModal.Button.Delete')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};


export default DeleteUserDialog;
