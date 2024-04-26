import { VFC } from 'react';

import { Card, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { DataGridStyle } from './TenantsListTable.styles';
import useTenantsListColumns from './useTenantsListColumns';
import { ROWS_PER_PAGE } from '../../TenantsBrowseView/TenantsBrowseView.utils';

const TenantsListTable: VFC = ({

}) => {
    const tenantsListColumns = useTenantsListColumns();

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        sx={DataGridStyle}
                        autoHeight
                        columns={tenantsListColumns}
                        rows={[]}
                        rowCount={0}
                        // loading={activated.loading}
                        // page={page}
                        // onPageChange={(newPage) => onPageChange(newPage)}
                        // pageSize={pageSize}
                        // onPageSizeChange={(newPageSize) => onPageSizeChange(newPageSize)}
                        disableSelectionOnClick
                        // onRowClick={({ row }) => openUserEditDialog(row)}
                        paginationMode='server'
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        // localeText={{
                        //     noRowsLabel: translate('Users.List.Table.Error.Rows')
                        // }}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default TenantsListTable;
