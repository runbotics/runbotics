import React, { FC, useContext, useEffect, useState } from 'react';

import {
    Typography,
    List,
    ListItem,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { Role, UserDto } from 'runbotics-common';
import styled from 'styled-components';

import CustomDialog from '#src-app/components/CustomDialog';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch, { UserSearchType } from '#src-app/hooks/useUserSearch';
import { useDispatch, useSelector } from '#src-app/store';
import { usersActions, usersSelector } from '#src-app/store/slices/Users';

import { TablePagingContext } from '../utils/TablePaging.provider';


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
    getSelectedUsers: () => UserDto[];
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
    const hasTenantAdminAccess = useRole([Role.ROLE_TENANT_ADMIN]);

    const { page, pageSize } = useContext(TablePagingContext);
    const { refreshSearch: refreshSearchNotActivated } = useUserSearch({ searchType: UserSearchType.ALL_NOT_ACTIVATED, page, pageSize });
    const { refreshSearch: refreshSearchActivated } = useUserSearch({ searchType: UserSearchType.ALL_ACTIVATED, page, pageSize });
    const { refreshSearch: refreshSearchTenantNotActivated } = useUserSearch({ searchType: UserSearchType.TENANT_NOT_ACTIVATED, page, pageSize });
    const { refreshSearch: refreshSearchTenantActivated } = useUserSearch({ searchType: UserSearchType.TENANT_ACTIVATED, page, pageSize });

    const [usersData, setUsersData] = useState<UserDto[]>([]);

    const handleSubmit = () => {
        Promise.allSettled(
            usersData.map((user) => hasTenantAdminAccess
                ? dispatch(usersActions.deleteUserInTenant({
                    resourceId: user.id,
                    payload: {
                        data: {
                            declineReason: `No consent by (tenant-admin@localhost) for user (${user.email}) activation`,
                        },
                    },
                }))
                : dispatch(usersActions.deleteUser({
                    resourceId: user.id,
                    data: {
                        declineReason: `No consent by (admin@localhost) for user (${user.email}) activation`,
                    },
                })))
        )
            .then((result) => {
                result.forEach((response) => {
                    if (response.status === 'fulfilled') {
                        const userEmail = usersData.find(
                            (user) => user.id === response.value.meta.arg.resourceId
                        ).email;

                        if ('error' in response.value) {
                            enqueueSnackbar(
                                translate(
                                    'Users.Actions.Modals.DeleteModal.Error',
                                    { userEmail }
                                ),
                                { variant: 'error' }
                            );
                        } else {
                            enqueueSnackbar(
                                translate(
                                    'Users.Actions.Modals.DeleteModal.Success',
                                    { userEmail }
                                ),
                                { variant: 'success' }
                            );
                        }
                    }
                });
            })
            .finally(() => {
                onClose();
                onDelete?.();

                const userActivated = usersData[0].activated;
                if (hasTenantAdminAccess) {
                    userActivated
                        ? refreshSearchTenantActivated()
                        : refreshSearchTenantNotActivated();
                } else {
                    userActivated
                        ? refreshSearchActivated()
                        : refreshSearchNotActivated();
                }
            });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { open && setUsersData(getSelectedUsers); }, [open]);

    return (
        // todo: next week this part will be redesigned according to UI/UX design
        <CustomDialog
            isOpen={open}
            onClose={onClose}
            title={translate('Users.Actions.Modals.DeleteModal.TitleMessage')}
            confirmButtonOptions={{
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
