import React, { FC } from 'react';

import { Grid, Card } from '@mui/material';
import { DataGrid, GridInputSelectionModel } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import useTranslations from '#src-app/hooks/useTranslations';
import { usersSelector } from '#src-app/store/slices/Users';

import { ROWS_PER_PAGE } from '../../UsersBrowseView/UsersBrowseView.utils';
import { DataGridStyle} from './UsersRegistrationTable.styles';
import useUsersRegistrationColumns from './useUsersRegistrationColumns';

interface UsersRegistrationTableProps {
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (pageSize: number) => void;
    selections: GridInputSelectionModel;
    handleSelectionChange: (selection: object) => void;
    handleSelectedRolesChange: (id: number, value: string) => void;
}

const UsersRegistrationTable: FC<UsersRegistrationTableProps> = ({
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
    selections,
    handleSelectionChange,
    handleSelectedRolesChange
}) => {
    const userRegistrationColumns = useUsersRegistrationColumns(handleSelectedRolesChange);
    const { notActivated } = useSelector(usersSelector);
    const { translate } = useTranslations();

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        sx={DataGridStyle}
                        autoHeight
                        columns={userRegistrationColumns}
                        rows={notActivated.allByPage?.content ?? []}
                        rowCount={notActivated.allByPage?.totalElements ?? 0}
                        loading={notActivated.loading}
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
