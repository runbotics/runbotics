import React, { FC, useState, useEffect, ChangeEvent } from 'react';

import { FormControl, MenuItem } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { Role, UserDto, ActivateUserDto } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch, { UserSearchType } from '#src-app/hooks/useUserSearch';
import { useDispatch } from '#src-app/store';
import { tenantsActions, tenantsSelector } from '#src-app/store/slices/Tenants';
import { usersActions, usersSelector } from '#src-app/store/slices/Users';

import { AVAILABLE_ROWS_PER_PAGE, DEFAULT_TABLE_PAGING_VALUES } from '#src-app/views/utils/TablePaging.provider';

import { CombinedUserWithTenant, getCombinedUserWithTenantIds } from './UsersRegistration.utils';
import UsersRegistrationTable from './UsersRegistrationTable';
import {
    StyledButtonsContainer,
    StyledButton,
    DeleteButton,
    StyledActionsContainer,
    StyledSearchFilterBox,
    StyledTextField,
    StyledSelect,
    StyledInputLabel,
    DeclineButton
} from './UsersRegistrationView.styles';
import DeleteUserDialog from '../DeleteUserDialog';

interface SelectedRoles { [id: number]: Role };

// eslint-disable-next-line max-lines-per-function
const UsersRegistrationView: FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasAdminAccess = useRole([Role.ROLE_ADMIN]);
    const hasTenantAdminAccess = useRole([Role.ROLE_TENANT_ADMIN]);

    const currentPage = parseInt(searchParams.get('page'));
    const pageSizeFromUrl = parseInt(searchParams.get('pageSize'));
    const [page, setPage] = useState(currentPage ? currentPage : DEFAULT_TABLE_PAGING_VALUES.page);
    const [limit, setLimit] = useState(
        pageSizeFromUrl && AVAILABLE_ROWS_PER_PAGE.includes(pageSizeFromUrl)
            ? pageSizeFromUrl
            : DEFAULT_TABLE_PAGING_VALUES.pageSize
    );
    const tenantParam = searchParams.get('tenantId');
    const [tenantSelection, setTenantSelection] = useState(tenantParam);
    const { all: allTenants } = useSelector(tenantsSelector);

    const { notActivated, tenantNotActivated } = useSelector(usersSelector);
    const { search, handleSearch, refreshSearch } = useUserSearch({
        searchType: hasAdminAccess ? UserSearchType.ALL_NOT_ACTIVATED : UserSearchType.TENANT_NOT_ACTIVATED,
        tenantId: tenantSelection,
        pageSize: limit,
        page
    });

    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<SelectedRoles>({});
    const [combinedUserWithTenantIds, setCombinedUserWithTenantIds] = useState<CombinedUserWithTenant>({});
    const [selections, setSelections] = useState<number[]>([]);

    const handleSelectedRolesChange = (id: number, value: Role) =>
        setSelectedRoles((prevState) => ({ ...prevState, [id]: value }));

    const handleSelectedTenantsChange = (id: number, value: string) =>
        setCombinedUserWithTenantIds((prevState) => ({ ...prevState, [id]: value }));

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
            const tenantId = combinedUserWithTenantIds[userId];
            return mapUserActivateRequest(userId, role, tenantId);
        });

        handleSubmit(payload);
    };

    const mapUserActivateRequest = (id: number, role: Role, tenantId: string): ActivateUserDto => ({
        id,
        roles: [role],
        message: translate('Users.Registration.View.Events.Success.Message'),
        ...(tenantId && { tenantId })
    });

    const handleSubmit = (activations: ActivateUserDto[]) =>
        Promise
            .allSettled(
                hasAdminAccess
                    ? activations.map((activationDto) => dispatch(usersActions.activate(activationDto)))
                    : activations.map((activationDto) => dispatch(usersActions.activateInTenant({ payload: activationDto, resourceId: activationDto.id })))
            )
            .then(() => {
                enqueueSnackbar(translate('Users.Registration.View.Events.Success.AcceptingUser'), { variant: 'success' });
                refreshSearch();
            })
            .catch(() => {
                enqueueSnackbar(translate('Users.Registration.View.Events.Error.AcceptFailed'), { variant: 'error' });
            });

    const handleDialogOpen = () => setIsDeleteDialogVisible(true);

    const getSelectedUsers = (): UserDto[] => hasAdminAccess
        ? notActivated.allByPage.content.filter((user) => selections.includes(user.id))
        : tenantNotActivated.allByPage.content.filter((user) => selections.includes(user.id));

    useEffect(() => {
        const allUsers = hasAdminAccess ? notActivated.allByPage : tenantNotActivated.allByPage;
        setCombinedUserWithTenantIds(
            hasAdminAccess
                ? getCombinedUserWithTenantIds(notActivated.allByPage?.content)
                : getCombinedUserWithTenantIds(tenantNotActivated.allByPage?.content)
        );

        const isPageNotAvailable = allUsers?.totalPages && page >= allUsers?.totalPages;
        if (isPageNotAvailable) {
            router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit } });
            setPage(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notActivated.allByPage, tenantNotActivated.allByPage]);

    useEffect(() => {
        refreshSearch();

        if (hasAdminAccess) dispatch(tenantsActions.getAll());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {(hasAdminAccess || hasTenantAdminAccess) && <DeleteUserDialog
                open={isDeleteDialogVisible}
                onClose={() => setIsDeleteDialogVisible(false)}
                getSelectedUsers={getSelectedUsers}
            />}
            <StyledActionsContainer>
                <StyledSearchFilterBox>
                    <StyledTextField
                        margin='dense'
                        placeholder={translate(
                            'Users.Registration.View.SearchBarPlaceholder'
                        )}
                        size='small'
                        value={search}
                        onChange={handleSearch}
                    />
                    <If condition={hasAdminAccess}>
                        <FormControl size='small'>
                            <StyledInputLabel>
                                {translate(
                                    'Users.Registration.View.Select.Label'
                                )}
                            </StyledInputLabel>
                            <StyledSelect
                                label={translate(
                                    'Users.Registration.View.Select.Label'
                                )}
                                value={tenantSelection}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ) => {
                                    setTenantSelection(e.target.value);
                                }}
                            >
                                <MenuItem value=''>
                                    {translate(
                                        'Users.Registration.View.Select.NoneTenant'
                                    )}
                                </MenuItem>
                                {allTenants.map((tenant) => (
                                    <MenuItem
                                        value={tenant.id}
                                        key={tenant.name}
                                    >
                                        {tenant.name}
                                    </MenuItem>
                                ))}
                            </StyledSelect>
                        </FormControl>
                    </If>
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
                    <If
                        condition={hasAdminAccess}
                        else={
                            <DeclineButton
                                type='submit'
                                variant='contained'
                                onClick={handleDialogOpen}
                                disabled={!selections.length}
                            >
                                {translate('Users.Registration.View.Button.Decline')}
                            </DeclineButton>
                        }
                    >
                        <DeleteButton
                            type='submit'
                            variant='contained'
                            onClick={handleDialogOpen}
                            disabled={!selections.length}
                        >
                            {translate('Users.Registration.View.Button.Delete')}
                        </DeleteButton>
                    </If>
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
                handleSelectedTenantsChange={handleSelectedTenantsChange}
                isForAdmin={hasAdminAccess}
                isTenantSelected={!!tenantSelection || !hasAdminAccess}
            />
        </>
    );
};

export default UsersRegistrationView;
