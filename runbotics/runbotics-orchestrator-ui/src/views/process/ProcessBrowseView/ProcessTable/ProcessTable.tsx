import React, { useContext, VFC } from 'react';

import { Card, Grid } from '@mui/material';
import { DataGrid, GridFilterModel } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { IProcess } from 'runbotics-common';

import { buildProcessUrl } from 'src/components/Tile/ProcessTile';
import { ProcessPageContext } from 'src/providers/ProcessPage.provider';
import { useSelector } from 'src/store';

import useProcessColumns from './useProcessColumns';

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30];

interface ProcessTableProps {
    onAdvancedSearchChange: (filterModel: GridFilterModel) => void;
}

const ProcessTable: VFC<ProcessTableProps> = ({ onAdvancedSearchChange }) => {
    const columns = useProcessColumns();
    const router = useRouter();
    const { page: processesPage, loading } = useSelector((state) => state.process.all);
    const { page, pageSize, handleTablePageChange, handlePageSizeChange } = useContext(ProcessPageContext);
    const handleRedirect = (process: IProcess) => {
        router.push(buildProcessUrl(process));
    };

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={processesPage?.content ?? []}
                        rowCount={processesPage?.totalElements ?? 0}
                        disableSelectionOnClick
                        disableColumnSelector
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        page={page}
                        onPageChange={handleTablePageChange}
                        paginationMode="server"
                        loading={loading}
                        filterMode="server"
                        onFilterModelChange={onAdvancedSearchChange}
                        onCellClick={(param) => {
                            if (param.field !== 'actions') handleRedirect(param.row);
                        }}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default ProcessTable;
