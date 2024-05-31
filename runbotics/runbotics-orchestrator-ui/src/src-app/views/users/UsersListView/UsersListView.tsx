import React, { FC, useState, useEffect, ChangeEvent } from 'react';

import { FormControl, MenuItem } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { IUser, Role } from 'runbotics-common';

import InviteCodeButton from '#src-app/components/InviteCodeButton';
import If from '#src-app/components/utils/If';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import useUserSearch, { UserSearchType } from '#src-app/hooks/useUserSearch';
import { useDispatch } from '#src-app/store';
import { tenantsActions, tenantsSelector } from '#src-app/store/slices/Tenants';
import { usersSelector } from '#src-app/store/slices/Users';

import UsersListEditDialog from './UsersListEdit';
import UsersListTable from './UsersListTable';
import { StyledActionsContainer, StyledInputLabel, StyledSearchFilterBox, StyledSelect, StyledTextField } from './UsersListView.styles';
import { DefaultPageValue, ROWS_PER_PAGE } from '../UsersBrowseView/UsersBrowseView.utils';

const UsersListView: FC = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasAdminAccess = useRole([Role.ROLE_ADMIN]);

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

    const { activated, tenantActivated } = useSelector(usersSelector);
    const { search, handleSearch, refreshSearch } = useUserSearch({
        searchType: hasAdminAccess ? UserSearchType.ALL_ACTIVATED : UserSearchType.TENANT_ACTIVATED,
        tenantId: tenantSelection,
        pageSize: limit,
        page
    });

    const [userData, setUserData] = useState<IUser>();
    const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);

    const handleOpenEditDialog = (rowData) => {
        setIsEditDialogVisible(true);
        setUserData(rowData);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogVisible(false);
    };

    useEffect(() => {
        const allUsers = hasAdminAccess ? activated.allByPage : tenantActivated.allByPage;

        const isPageNotAvailable = allUsers?.totalPages && page >= allUsers?.totalPages;
        if (isPageNotAvailable) {
            router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit } });
            setPage(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activated.allByPage, tenantActivated.allByPage]);

    useEffect(() => {
        refreshSearch();

        if (hasAdminAccess) {
            dispatch(tenantsActions.getAll());
        } else {
            dispatch(tenantsActions.getInviteCode());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <UsersListEditDialog
                open={isEditDialogVisible}
                onClose={handleCloseEditDialog}
                userData={userData}
                isForAdmin={hasAdminAccess}
            />
            <StyledActionsContainer>
                <StyledSearchFilterBox>
                    <StyledTextField
                        margin='dense'
                        placeholder={translate('Users.List.View.SearchBarPlaceholder')}
                        size='small'
                        value={search}
                        onChange={handleSearch}
                    />
                    <If condition={hasAdminAccess}>
                        <FormControl size='small'>
                            <StyledInputLabel>{translate('Users.List.View.Select.Label')}</StyledInputLabel>
                            <StyledSelect
                                label={translate('Users.List.View.Select.Label')}
                                value={tenantSelection}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setTenantSelection(e.target.value);
                                }}
                            >
                                <MenuItem value=''>{translate('Users.List.View.Select.NoneTenant')}</MenuItem>
                                {allTenants.map(tenant => (
                                    <MenuItem value={tenant.id} key={tenant.name}>{tenant.name}</MenuItem>
                                ))}
                            </StyledSelect>
                        </FormControl>
                    </If>
                </StyledSearchFilterBox>
                <If condition={!hasAdminAccess}>
                    <InviteCodeButton/>
                </If>
            </StyledActionsContainer>
            <UsersListTable
                page={page}
                onPageChange={setPage}
                pageSize={limit}
                onPageSizeChange={setLimit}
                openUserEditDialog={handleOpenEditDialog}
                isForAdmin={hasAdminAccess}
                isTenantSelected={!!tenantSelection || !hasAdminAccess}
            />
        </>
    );
};

export default UsersListView;
