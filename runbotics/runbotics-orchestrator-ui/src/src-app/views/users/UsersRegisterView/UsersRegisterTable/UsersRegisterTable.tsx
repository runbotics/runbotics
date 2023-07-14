import React, { VFC } from 'react';

import { Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import { usersSelector } from '#src-app/store/slices/Users';

import { StyledGrid } from './UsersRegisterTable.styles';
import useUsersRegisterColumns from './useUsersRegisterColumns';

// TEST DATA
const rows = [
    { id: 1, username: 'Test1', createDate: 1234},
    { id: 2, username: 'Test2', createDate: 4321},
];
// TEST DATA

interface TableProps {
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (pageSize: number) => void;
}

const UsersRegisterTable: VFC<TableProps> = ({
    page,
    onPageChange,
    pageSize,
    onPageSizeChange
}) => {
    const userRegisterColumns = useUsersRegisterColumns();
    const { allNotActivatedByPage, loading } = useSelector(usersSelector);
    
    return (
        <Card>
            <StyledGrid container>
                <StyledGrid item xs={12} md={12}>
                    <DataGrid
                        autoHeight
                        columns={userRegisterColumns}
                        rows={allNotActivatedByPage?.content ?? []}
                        rowCount={allNotActivatedByPage?.totalElements ?? 0}
                        loading={loading}
                        page={page}
                        onPageChange={(newPage) => onPageChange(newPage)}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => onPageSizeChange(newPageSize)}
                        disableSelectionOnClick
                    />
                </StyledGrid>
            </StyledGrid>
        </Card>
    );
};

export default UsersRegisterTable;
