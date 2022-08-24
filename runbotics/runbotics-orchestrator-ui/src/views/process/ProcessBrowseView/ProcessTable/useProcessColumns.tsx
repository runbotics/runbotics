import { Typography } from '@mui/material';
import { getGridStringOperators, GridCellParams, GridColDef, GridFilterOperator } from '@mui/x-data-grid';
import moment from 'moment';
import React, { ReactNode } from 'react';
import { ProcessTileActions } from 'src/components/Tile/ProcessTile';
import { TileAvatar, DATE_FORMAT } from 'src/components/Tile';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { red } from '@mui/material/colors';
import { IProcess } from 'runbotics-common';

const filterOperators = getGridStringOperators().filter(({ value }) => value === 'contains');

const useProcessColumns = (): GridColDef[] => [
    {
        field: 'avatar',
        width: 50,
        resizable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderHeader: (): ReactNode => <div />,
        renderCell: (params: GridCellParams) => (
            <TileAvatar title={params.row.name} />
        ),
    },
    {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        filterable: true,
        filterOperators,
        disableColumnMenu: false,
        renderCell: (params: GridCellParams) => (
            <Typography color="textPrimary" variant="h5">
                {params.row.name}
            </Typography>
        ),
    },
    {
        field: 'date',
        headerName: 'Created',
        flex: 1,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridCellParams) => (
            <Typography color="textPrimary" variant="h6">
                {moment(params.row.created).format(DATE_FORMAT)}
            </Typography>
        ),
        valueGetter: (params) => moment(params.row.created).format('x'),
        sortComparator: (v1, v2, cellParams1, cellParams2) => +cellParams1.value - +cellParams2.value,
    },
    {
        field: 'createdBy',
        headerName: 'Creator',
        flex: 1,
        filterable: true,
        filterOperators,
        disableColumnMenu: false,
        renderCell: (params: GridCellParams) => (
            <Typography color="textPrimary" variant="h6">
                {params.row.createdBy ? params.row.createdBy.login : 'RunBotics'}
            </Typography>
        ),
    },
    {
        field: 'updated',
        headerName: 'Updated',
        flex: 1,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridCellParams) => (
            <Typography color="textPrimary" variant="h6">
                {moment(params.row.updated).locale('en').fromNow()}
            </Typography>
        ),
        valueGetter: (params) => moment(params.row.updated).format('x'),
        sortComparator: (v1, v2, cellParams1, cellParams2) => +cellParams1.value - +cellParams2.value,
    },
    {
        field: 'scheduled',
        headerName: 'Scheduled',
        flex: 1,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridCellParams) => (
            (params.row as IProcess).schedules && (params.row as IProcess).schedules.length > 0
                ? <CheckCircleOutlineOutlinedIcon color="success" />
                : <RemoveCircleOutlineOutlinedIcon sx={{ color: red[500] }} />
        ),
    },
    {
        field: 'actions',
        headerName: 'Actions',
        filterable: false,
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params: GridCellParams) => <ProcessTileActions process={params.row} />,
    },
];

export default useProcessColumns;
