import React, { ReactNode } from 'react';

import { Grid, Paper, Typography } from '@mui/material';
import { Row } from 'react-table';

import Table, { Column } from '../../components/Table';

interface SchedulerTableContainerProps<T extends object> {
    title: string;
    columns: Column<T>[];
    processes: T[];
    onRedirect?: (rowData: T) => void;
    renderSubRow?: (row: Row<T>) => ReactNode;
}

const SchedulerTableContainer = <T extends object>({
    title,
    processes,
    columns,
    onRedirect,
    renderSubRow,
}: SchedulerTableContainerProps<T>) => (
        <Paper sx={{ padding: '1rem' }}>
            <Grid container sx={{ marginBottom: '1rem' }} justifyContent="space-between">
                <Grid item>
                    <Typography variant="h4">{title}</Typography>
                </Grid>
            </Grid>
            <Table<T> columns={columns} data={processes} onRowClick={onRedirect} renderSubRow={renderSubRow} autoHeight />
        </Paper>
    );

export default SchedulerTableContainer;
