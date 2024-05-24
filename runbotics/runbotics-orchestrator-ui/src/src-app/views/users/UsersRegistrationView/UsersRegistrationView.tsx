import React, { FC, useState, useEffect, ChangeEvent } from 'react';

import { FormControl, InputLabel, MenuItem } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { Role, IUser } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch from '#src-app/hooks/useUserSearch';
import { useDispatch } from '#src-app/store';
import { tenantsSelector } from '#src-app/store/slices/Tenants';
import { usersActions, usersSelector } from '#src-app/store/slices/Users';

import UsersRegistrationTable from './UsersRegistrationTable';
import {
    StyledButtonsContainer,
    StyledButton,
    DeleteButton,
    StyledActionsContainer,
    StyledSearchFilterBox,
    StyledTextField,
    StyledSelect
} from './UsersRegistrationView.styles';
import DeleteUserDialog from '../DeleteUserDialog';
import { DefaultPageValue, ROWS_PER_PAGE } from '../UsersBrowseView/UsersBrowseView.utils';

interface SelectedRoles { [id: number]: Role };
interface MapActivatedUserParams {
    id: number;
    email: string;
    roles: Role[];
    activated: boolean;
}

// eslint-disable-next-line max-lines-per-function
const UsersRegistrationView: FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = parseInt(searchParams.get('page'));
    const pageSizeFromUrl = parseInt(searchParams.get('pageSize'));
    const [page, setPage] = useState(currentPage ? currentPage : DefaultPageValue.PAGE);
    const [limit, setLimit] = useState(
        pageSizeFromUrl && ROWS_PER_PAGE.includes(pageSizeFromUrl)
            ? pageSizeFromUrl
            : DefaultPageValue.PAGE_SIZE
    );
    const tenantParam = searchParams.get('tenantId');
    const [tenantSelection, setTenantSelection] = useState(tenantParam);
    const { all: allTenants } = useSelector(tenantsSelector);

    const { notActivated } = useSelector(usersSelector);
    const { search, handleSearch, refreshSearch: refreshSearchNotActivated } = useUserSearch({
        tenantId: tenantSelection,
        pageSize: limit,
        page
    });

    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<SelectedRoles>({});
    const [selections, setSelections] = useState<number[]>([]);

    const handleSelectedRolesChange = (id: number, value: Role) =>
        setSelectedRoles((prevState) => ({ ...prevState, [id]: value }));

    const handleSelectionChange = (selection) => setSelections(selection);

    const checkUserHasSelectedRole = (userId: number): boolean => !!selectedRoles[userId];

    const handleAccept = () => {
        const hasEveryUserSelectedRole = selections.every(checkUserHasSelectedRole);
        if (!hasEveryUserSelectedRole) {
            enqueueSnackbar(translate('Users.Registration.View.Events.Error.RolesNotSelected'), { variant: 'error' });
            return;
        }

        const payload = selections.map((userId) => {
            const role = selectedRoles[userId];
            return mapUserActivateRequest(userId, role);
        });

        handleSubmit(payload);
    };

    const mapUserActivateRequest = (id: number, role: Role): MapActivatedUserParams => {
        const { email } = notActivated.allByPage.content.find((row) => row.id === id);
        return { id, email, roles: [role], activated: true };
    };

    const handleSubmit = (usersData: IUser[]) =>
        Promise
            .allSettled(
                usersData.map((user) => dispatch(usersActions.updateNotActivated(user))))
            .then(() => {
                enqueueSnackbar(translate('Users.Registration.View.Events.Success.AcceptingUser'), { variant: 'success' });
                refreshSearchNotActivated();
            })
            .catch(() => {
                enqueueSnackbar(translate('Users.Registration.View.Events.Error.AcceptFailed'), { variant: 'error' });
            });

    const handleDelete = () => setIsDeleteDialogVisible(true);

    const getSelectedUsers = (): IUser[] => notActivated.allByPage.content.filter((user) => selections.includes(user.id));

    useEffect(() => {
        const isPageNotAvailable = notActivated.allByPage?.totalPages && page >= notActivated.allByPage?.totalPages;
        if (isPageNotAvailable) {
            router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit } });
            setPage(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notActivated.allByPage]);

    useEffect(() => {
        refreshSearchNotActivated();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DeleteUserDialog
                open={isDeleteDialogVisible}
                onClose={() => setIsDeleteDialogVisible(false)}
                getSelectedUsers={getSelectedUsers}
            />
            <StyledActionsContainer>
                <StyledSearchFilterBox>
                    <StyledTextField
                        margin='dense'
                        placeholder={translate('Users.Registration.View.SearchBarPlaceholder')}
                        size='small'
                        value={search}
                        onChange={handleSearch}
                    />
                    <FormControl size='small'>
                        <InputLabel>{translate('Users.Registration.View.Select.Label')}</InputLabel>
                        <StyledSelect
                            label={translate('Users.Registration.View.Select.Label')}
                            value={tenantSelection}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setTenantSelection(e.target.value);
                            }}
                        >
                            <MenuItem value=''>{translate('Users.Registration.View.Select.NoneTenant')}</MenuItem>
                            {allTenants.map(tenant => (
                                <MenuItem value={tenant.id} key={tenant.name}>{tenant.name}</MenuItem>
                            ))}
                        </StyledSelect>
                    </FormControl>
                </StyledSearchFilterBox>
                <StyledButtonsContainer>
                    <StyledButton
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={handleAccept}
                        disabled={!selections.length}
                    >
                        {translate('Users.Registration.View.Button.Accept')}
                    </StyledButton>
                    <DeleteButton
                        type='submit'
                        variant='contained'
                        onClick={handleDelete}
                        disabled={!selections.length}
                    >
                        {translate('Users.Registration.View.Button.Delete')}
                    </DeleteButton>
                </StyledButtonsContainer>
            </StyledActionsContainer>
            <UsersRegistrationTable
                page={page}
                onPageChange={setPage}
                pageSize={limit}
                onPageSizeChange={setLimit}
                selections={selections}
                handleSelectionChange={handleSelectionChange}
                handleSelectedRolesChange={handleSelectedRolesChange}
                isTenantSelected={!!tenantSelection}
            />
        </>
    );
};

export default UsersRegistrationView;
