import React from 'react';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { getGridStringOperators, GridCellParams, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';

import { DATE_FORMAT } from '#src-app/components/Tile';

import useTranslations from '#src-app/hooks/useTranslations';

const filterOperators = getGridStringOperators().filter(({ value }) => value === 'contains');

const useBotCollectionColumns = (): GridColDef[] => {
    const { translate } = useTranslations();

    return [
        {
            field: 'name',
            headerName: translate('Bot.Collection.Table.Header.Name'),
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
            field: 'createdBy',
            headerName: translate('Bot.Collection.Table.Header.Creator'),
            flex: 1,
            filterable: true,
            filterOperators,
            disableColumnMenu: false,
            renderCell: (params: GridCellParams) => (
                <Typography color="textPrimary" variant="h6">
                    {params.row.createdByUser ? params.row.createdByUser.email : 'RunBotics'}
                </Typography>
            ),
        },
        {
            field: 'publicBotsIncluded',
            headerName: translate('Bot.Collection.Table.Header.PublicIncluded'),
            flex: 1,
            filterable: false,
            filterOperators,
            disableColumnMenu: false,
            renderCell: (params: GridCellParams) =>
                params.row.publicBotsIncluded ? (
                    <CheckCircleOutlineOutlinedIcon color="success" />
                ) : (
                    <RemoveCircleOutlineOutlinedIcon sx={{ color: red[500] }} />
                ),
        },
        {
            field: 'date',
            headerName: translate('Bot.Collection.Table.Header.Created'),
            flex: 1,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <Typography color="textPrimary" variant="h6">
                    {params.row.created ? moment(params.row.created).format(DATE_FORMAT) : ''}
                </Typography>
            ),
            valueGetter: (params) => (params.row.created ? moment(params.row.created).format(DATE_FORMAT) : ''),
            // eslint-disable-next-line max-params
            sortComparator: (v1, v2, cellParams1, cellParams2) => +cellParams1.value - +cellParams2.value,
        },
        {
            field: 'updated',
            headerName: translate('Bot.Collection.Table.Header.LastModified'),
            flex: 1,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <Typography color="textPrimary" variant="h6">
                    {params.row.updated ? moment(params.row.updated).format('YYYY-MM-DD HH:mm') : ''}
                </Typography>
            ),
            valueGetter: (params) => (params.row.updated ? moment(params.row.updated).format('YYYY-MM-DD HH:mm') : ''),
            // eslint-disable-next-line max-params
            sortComparator: (v1, v2, cellParams1, cellParams2) => +cellParams1.value - +cellParams2.value,
        },
    ];
};

export default useBotCollectionColumns;
