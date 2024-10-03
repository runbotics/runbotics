import { VFC, useState, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Tenant } from 'runbotics-common';

import useTenantSearch from '#src-app/hooks/useTenantSearch';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { tenantsSelector } from '#src-app/store/slices/Tenants';

import TenantsListEditDialog from './TenantsListEdit';
import TenantsListTable from './TenantsListTable/TenantsListTable';
import { StyledActionsContainer, StyledButton, StyledTextField } from './TenantsListView.styles';
import CreateTenantDialog from '../CreateTenantDialog';
import { ROWS_PER_PAGE, DefaultPageValue } from '../TenantsBrowseView/TenantsBrowseView.utils';

const TenantsListView: VFC = () => {
    const { translate } = useTranslations();
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

    const { allByPage } = useSelector(tenantsSelector);

    const { search, handleSearch, refreshSearch } = useTenantSearch({ page, pageSize: limit });

    const [tenantData, setTenantData] = useState<Tenant>();
    const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
    const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);

    const openEditDialog = (rowData) => {
        setIsEditDialogVisible(true);
        setTenantData(rowData);
    };

    const closeEditDialog = () => {
        setIsEditDialogVisible(false);
    };

    const openCreateDialog = () => {
        setIsCreateDialogVisible(true);
    };

    const closeCreateDialog = () => {
        setIsCreateDialogVisible(false);
    };

    useEffect(() => {
        const isPageNotAvailable = allByPage?.totalPages && page >= allByPage?.totalPages;
        if (isPageNotAvailable) {
            router.replace({ pathname: router.pathname, query: { page: 0, pageSize: limit } });
            setPage(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allByPage]);

    useEffect(() => {
        refreshSearch();
    }, []);

    return (
        <>
            <CreateTenantDialog
                open={isCreateDialogVisible}
                onClose={closeCreateDialog}
            />
            <TenantsListEditDialog
                open={isEditDialogVisible}
                onClose={closeEditDialog}
                tenantData={tenantData}
            />
            <StyledActionsContainer>
                <StyledTextField
                    margin='dense'
                    placeholder={translate('Tenants.List.View.SearchBarPlaceholder')}
                    size='small'
                    value={search}
                    onChange={handleSearch}
                />
                <StyledButton
                    variant='contained'
                    color='primary'
                    onClick={openCreateDialog}
                >
                    {translate('Tenants.List.View.Button.CreateTenant')}
                </StyledButton>
            </StyledActionsContainer>
            <TenantsListTable
                page={page}
                onPageChange={setPage}
                pageSize={limit}
                onPageSizeChange={setLimit}
                openTenantEditDialog={openEditDialog}
            />
        </>
    );
};

export default TenantsListView;
