import { VFC } from 'react';

import { Card, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { tenantsSelector } from '#src-app/store/slices/Tenants';

import { DataGridStyle } from './TenantsListTable.styles';
import useTenantsListColumns from './useTenantsListColumns';
import { ROWS_PER_PAGE } from '../../TenantsBrowseView/TenantsBrowseView.utils';

interface TenantListTableProps {
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (pageSize: number) => void;
    openTenantEditDialog: (row) => void;
}

const TenantsListTable: VFC<TenantListTableProps> = ({
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
    openTenantEditDialog
}) => {
    const { translate } = useTranslations();

    const tenantsListColumns = useTenantsListColumns(pageSize, openTenantEditDialog);
    const { loading, allByPage } = useSelector(tenantsSelector);

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        sx={DataGridStyle}
                        autoHeight
                        columns={tenantsListColumns}
                        rows={allByPage?.content ?? []}
                        rowCount={allByPage?.totalElements ?? 0}
                        loading={loading}
                        page={page}
                        onPageChange={(newPage) => onPageChange(newPage)}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => onPageSizeChange(newPageSize)}
                        disableSelectionOnClick
                        paginationMode='server'
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        localeText={{
                            noRowsLabel: translate('Tenants.List.Table.Error.Rows')
                        }}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default TenantsListTable;
