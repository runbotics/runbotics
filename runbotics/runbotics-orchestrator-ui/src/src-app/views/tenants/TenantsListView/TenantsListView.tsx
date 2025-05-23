import { VFC, useState, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Tenant } from 'runbotics-common';

import useTenantSearch from '#src-app/hooks/useTenantSearch';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { tenantsActions, tenantsSelector } from '#src-app/store/slices/Tenants';


import TenantPluginsDrawer from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsDrawer';
import TablePagingProvider, { AVAILABLE_ROWS_PER_PAGE, DEFAULT_TABLE_PAGING_VALUES } from '#src-app/views/utils/TablePaging.provider';


import TenantsListEditDialog from './TenantsListEdit';
import TenantsListTable from './TenantsListTable/TenantsListTable';
import { StyledActionsContainer, StyledButton, StyledTextField } from './TenantsListView.styles';
import CreateTenantDialog from '../CreateTenantDialog';



const TenantsListView: VFC = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = parseInt(searchParams.get('page'));
    const pageSizeFromUrl = parseInt(searchParams.get('pageSize'));
    const [page, setPage] = useState(currentPage ? currentPage : DEFAULT_TABLE_PAGING_VALUES.page);
    const [limit, setLimit] = useState(
        pageSizeFromUrl && AVAILABLE_ROWS_PER_PAGE.includes(pageSizeFromUrl)
            ? pageSizeFromUrl
            : DEFAULT_TABLE_PAGING_VALUES.pageSize
    );

    const { allByPage } = useSelector(tenantsSelector);
    
    const { search, handleSearch, refreshSearch } = useTenantSearch({ page, pageSize: limit });

    const [tenantData, setTenantData] = useState<Tenant>();
    const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
    const [isCreateDialogVisible, setIsCreateDialogVisible] = useState(false);
    const [isPluginDrawerVisible, setIsPluginDrawerVisible] = useState(false);

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
    
    const openPluginDrawer = (rowData) => {
        dispatch(tenantsActions.fetchTenantPlugins(rowData.id));
        setIsPluginDrawerVisible(true);
        setTenantData(rowData);
    };
    
    const closePluginDrawer = () => {
        setIsPluginDrawerVisible(false);
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
        <TablePagingProvider page={page} pageSize={limit}>
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
                openTenantPluginDrawer={openPluginDrawer}
            />
            <TenantPluginsDrawer open={isPluginDrawerVisible} onClose={closePluginDrawer} tenantData={tenantData} />
        </TablePagingProvider>
    );
};

export default TenantsListView;
