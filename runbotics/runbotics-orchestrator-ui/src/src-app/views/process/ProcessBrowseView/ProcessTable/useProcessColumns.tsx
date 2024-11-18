import React, { ReactNode } from 'react';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { getGridStringOperators, GridCellParams, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import { IProcess } from 'runbotics-common';

import { TileAvatar, DATE_FORMAT } from '#src-app/components/Tile';
import ProcessTileActions from '#src-app/components/Tile/ProcessTile/ProcessTileActions';
import useTranslations from '#src-app/hooks/useTranslations';

const filterOperators = getGridStringOperators().filter(({ value }) => value === 'contains');

const useProcessColumns = (): GridColDef[] => {
    const { translate } = useTranslations();
    return [
        {
            field: 'avatar',
            width: 50,
            resizable: false,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderHeader: (): ReactNode => <div />,
            renderCell: (params: GridCellParams) => <TileAvatar title={params.row.name} />,
        },
        {
            field: 'name',
            headerName: translate('Process.List.Table.Header.Name'),
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
            headerName: translate('Process.List.Table.Header.Created'),
            flex: 1,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <Typography color="textPrimary" variant="h6">
                    {moment(params.row.created).format(DATE_FORMAT)}
                </Typography>
            ),
            valueGetter: (params) => moment(params.row.created).format('x'),
            // eslint-disable-next-line max-params
            sortComparator: (v1, v2, cellParams1, cellParams2) => +cellParams1.value - +cellParams2.value,
        },
        {
            field: 'createdBy',
            headerName: translate('Process.List.Table.Header.Creator'),
            flex: 1,
            filterable: true,
            filterOperators,
            disableColumnMenu: false,
            renderCell: (params: GridCellParams) => (
                <Typography color="textPrimary" variant="h6">
                    {params.row.createdBy ? params.row.createdBy.email : 'RunBotics'}
                </Typography>
            ),
        },
        {
            field: 'updated',
            headerName: translate('Process.List.Table.Header.Updated'),
            flex: 1,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <Typography color="textPrimary" variant="h6">
                    {moment(params.row.updated).fromNow()}
                </Typography>
            ),
            valueGetter: (params) => moment(params.row.updated).format('x'),
            // eslint-disable-next-line max-params
            sortComparator: (v1, v2, cellParams1, cellParams2) => +cellParams1.value - +cellParams2.value,
        },
        {
            field: 'scheduled',
            headerName: translate('Process.List.Table.Header.Scheduled'),
            flex: 1,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) =>
                (params.row as IProcess).schedules && (params.row as IProcess).schedules.length > 0 ? (
                    <CheckCircleOutlineOutlinedIcon color="success" />
                ) : (
                    <RemoveCircleOutlineOutlinedIcon sx={{ color: red[500] }} />
                ),
        },
        {
            field: 'actions',
            headerName: translate('Process.List.Table.Header.Actions'),
            filterable: false,
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params: GridCellParams) => <ProcessTileActions process={params.row} />,
        },
    ];
};

export default useProcessColumns;
