import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Column } from 'react-table';
import Table from '../../components/Table';

// eslint-disable-next-line @typescript-eslint/ban-types
interface SchedulerTableContainerProps<T extends object> {
    title: string;
    columns: Column<T>[];
    processes: T[];
}

// eslint-disable-next-line @typescript-eslint/comma-dangle, @typescript-eslint/ban-types
const SchedulerTableContainer = <T extends object, >({
    title, processes, columns,
}: SchedulerTableContainerProps<T>) => (
    <Paper sx={{ padding: '1rem' }}>
        <Grid container sx={{ marginBottom: '1rem' }} justifyContent="space-between">
            <Grid item>
                <Typography variant="h4">{title}</Typography>
            </Grid>
        </Grid>
        <Table<T> columns={columns} data={processes} autoHeight />
    </Paper>
    );

export default SchedulerTableContainer;
