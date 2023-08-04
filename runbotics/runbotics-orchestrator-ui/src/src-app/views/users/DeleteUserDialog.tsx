import React, { FC, useEffect, useState } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Typography,
    List,
    ListItem,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { IUser } from 'runbotics-common';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch from '#src-app/hooks/useUserSearch';
import { usersActions } from '#src-app/store/slices/Users';

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
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {translate('Users.Actions.Modals.DeleteModal.Title')}
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {translate('Users.Actions.Modals.DeleteModal.Content')}
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
                <Button
                    color='primary'
                    onClick={onClose}
                >
                    {translate('Users.Actions.Modals.DeleteModal.Button.Cancel')}
                </Button>
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                >
                    {translate('Users.Actions.Modals.DeleteModal.Button.Confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default DeleteUserDialog;
