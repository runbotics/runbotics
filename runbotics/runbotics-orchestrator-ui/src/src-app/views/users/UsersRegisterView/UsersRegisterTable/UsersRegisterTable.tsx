import React, { VFC } from 'react';

import { Grid, Card } from '@mui/material';
import { DataGrid, GridInputSelectionModel } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import { usersSelector } from '#src-app/store/slices/Users';

import { ROWS_PER_PAGE } from '../../UsersBrowseView/UsersBrowseView.utils';
import { DataGridStyle} from './UsersRegisterTable.styles';
import useUsersRegisterColumns from './useUsersRegisterColumns';

interface TableProps {
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (pageSize: number) => void;
    selections: GridInputSelectionModel;
    handleSelectionChange: (selection: object) => void;
    handleSelectChange: any;
}

const UsersRegisterTable: VFC<TableProps> = ({
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
    selections,
    handleSelectionChange,
    handleSelectChange
}) => {
    const userRegisterColumns = useUsersRegisterColumns(handleSelectChange);
    const { allNotActivatedByPage, loading } = useSelector(usersSelector);

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        sx={DataGridStyle}
                        autoHeight
                        columns={userRegisterColumns}
                        rows={allNotActivatedByPage?.content ?? []}
                        rowCount={allNotActivatedByPage?.totalElements ?? 0}
                        loading={loading}
                        page={page}
                        onPageChange={(newPage) => onPageChange(newPage)}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => onPageSizeChange(newPageSize)}
                        checkboxSelection={true}
                        onSelectionModelChange={(e) => handleSelectionChange(e)}
                        selectionModel={selections}
                        paginationMode='server'
                        rowsPerPageOptions={ROWS_PER_PAGE}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default UsersRegisterTable;
