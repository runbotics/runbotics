import React, { FC } from 'react';

import { Grid, Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import useTranslations from '#src-app/hooks/useTranslations';
import { usersSelector } from '#src-app/store/slices/Users';

import { DataGridStyle} from './UsersListTable.styles';
import useUsersListColumns from './useUsersListColumns';
import { ROWS_PER_PAGE } from '../../UsersBrowseView/UsersBrowseView.utils';

interface UsersListTableProps {
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (pageSize: number) => void;
    openUserEditDialog: (row) => void;
    isForAdmin: boolean;
    isTenantSelected: boolean;
}

const UsersListTable: FC<UsersListTableProps> = ({
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
    openUserEditDialog,
    isForAdmin,
    isTenantSelected
}) => {
    const usersListColumns = useUsersListColumns();
    const { activated, tenantActivated } = useSelector(usersSelector);
    const { translate } = useTranslations();

    const userData = isForAdmin ? activated : tenantActivated;

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        sx={DataGridStyle}
                        autoHeight
                        columnVisibilityModel={{ tenant: !isTenantSelected }}
                        columns={usersListColumns}
                        rows={userData.allByPage?.content ?? []}
                        rowCount={userData.allByPage?.totalElements ?? 0}
                        loading={userData.loading}
                        page={page}
                        onPageChange={(newPage) => onPageChange(newPage)}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => onPageSizeChange(newPageSize)}
                        disableSelectionOnClick
                        onRowClick={({ row }) => openUserEditDialog(row)}
                        paginationMode='server'
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        localeText={{
                            noRowsLabel: translate('Users.List.Table.Error.Rows')
                        }}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default UsersListTable;
