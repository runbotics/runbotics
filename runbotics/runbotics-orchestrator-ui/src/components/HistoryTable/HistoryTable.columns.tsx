import React from 'react';
import { Column } from 'react-table';
import { IProcessInstance } from 'runbotics-common';
import moment from 'moment';
import { IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { translate } from 'src/hooks/useTranslations';
import { RowCustomExpandedSpan } from '../Table';
import Label from '../Label';
import { getProcessInstanceStatusColor } from '../../utils/getProcessInstanceStatusColor';

const processInstanceColumns: Column<IProcessInstance>[] = [
    {
        Header: ' ',
        id: 'expander',
        Cell: ({ row }) => (row.original.subProcesses && row.original.subProcesses.length > 0 ? (
            <RowCustomExpandedSpan isExpanded={row.isExpanded}>
                <IconButton {...row.getToggleRowExpandedProps()} size="small">
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            </RowCustomExpandedSpan>
        ) : null),
        width: '20px',
    },
    {
        Header: translate('Component.HistoryTable.Header.ProcessName'),
        accessor: ({ process }) => process?.name,
        width: '20%',
    },
    {
        Header: translate('Component.HistoryTable.Header.Status'),
        accessor: 'status',
        Cell: ({ value }) => <Label color={getProcessInstanceStatusColor(value)}>{value.replace('_', ' ')}</Label>,
    },
    {
        Header: translate('Component.HistoryTable.Header.Started'),
        accessor: 'created',
        Cell: ({ value }) => (value ? moment(value).format('DD/MM/yyyy HH:mm:ss') : ''),
    },
    {
        Header: translate('Component.HistoryTable.Header.Finished'),
        accessor: 'updated',
        Cell: ({ value }) => (value ? moment(value).format('DD/MM/yyyy HH:mm:ss') : ''),
    },
    {
        Header: translate('Component.HistoryTable.Header.Bot'),
        accessor: ({ bot }) => bot?.installationId,
    },
    {
        Header: translate('Component.HistoryTable.Header.Initiator'),
        accessor: ({ user, scheduled }) => (scheduled
            ? translate('Component.HistoryTable.Rows.Initiator', { login: user.login })
            : user?.login),
    },
];

export default processInstanceColumns;
