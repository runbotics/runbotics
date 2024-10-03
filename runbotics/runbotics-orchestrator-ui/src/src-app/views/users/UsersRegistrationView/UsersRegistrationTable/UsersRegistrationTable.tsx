import React, { FC } from 'react';

import { Grid, Card } from '@mui/material';
import { DataGrid, GridInputSelectionModel } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import useTranslations from '#src-app/hooks/useTranslations';
import { usersSelector } from '#src-app/store/slices/Users';

import { DataGridStyle} from './UsersRegistrationTable.styles';
import useUsersRegistrationColumns from './useUsersRegistrationColumns';
import { ROWS_PER_PAGE } from '../../UsersBrowseView/UsersBrowseView.utils';

interface UsersRegistrationTableProps {
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (pageSize: number) => void;
    selections: GridInputSelectionModel;
    handleSelectionChange: (selection: object) => void;
    handleSelectedRolesChange: (id: number, value: string) => void;
    handleSelectedTenantsChange: (id: number, value: string) => void;
    isForAdmin: boolean;
    isTenantSelected: boolean;
}

const UsersRegistrationTable: FC<UsersRegistrationTableProps> = ({
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
    selections,
    handleSelectionChange,
    handleSelectedRolesChange,
    handleSelectedTenantsChange,
    isForAdmin,
    isTenantSelected
}) => {
    const userRegistrationColumns = useUsersRegistrationColumns(
        handleSelectedRolesChange,
        handleSelectedTenantsChange,
        isForAdmin
    );
    const { notActivated, tenantNotActivated } = useSelector(usersSelector);
    const { translate } = useTranslations();

    const userData = isForAdmin ? notActivated : tenantNotActivated;

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        sx={DataGridStyle}
                        autoHeight
                        columnVisibilityModel={{ tenant: !isTenantSelected }}
                        columns={userRegistrationColumns}
                        rows={userData.allByPage?.content ?? []}
                        rowCount={userData.allByPage?.totalElements ?? 0}
                        loading={userData.loading}
                        page={page}
                        onPageChange={(newPage) => onPageChange(newPage)}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => onPageSizeChange(newPageSize)}
                        checkboxSelection={true}
                        onSelectionModelChange={(e) => handleSelectionChange(e)}
                        selectionModel={selections}
                        paginationMode='server'
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        localeText={{
                            noRowsLabel: translate('Users.Registration.Table.Error.Rows')
                        }}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default UsersRegistrationTable;
