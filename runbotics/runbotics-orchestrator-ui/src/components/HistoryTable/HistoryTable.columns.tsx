import React from 'react';
import { FeatureKey } from 'runbotics-common';
import moment from 'moment';
import { IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { capitalizeFirstLetter } from 'src/utils/text';
import useTranslations from 'src/hooks/useTranslations';
import useAuth from 'src/hooks/useAuth';
import { hasFeatureKeyAccess } from '../utils/Secured';
import { Column, RowCustomExpandedSpan } from '../Table';
import Label from '../Label';
import { getProcessInstanceStatusColor } from '../../utils/getProcessInstanceStatusColor';

const useProcessInstanceColumns = (): Column[] => {
    const { translate } = useTranslations();
    const { user } = useAuth();

    const columns = [
        {
            Header: ' ',
            id: 'expander',
            Cell: ({ row }) => (row.original.subProcesses && row.original.subProcesses.length > 0
                ? (
                    <RowCustomExpandedSpan isExpanded={row.isExpanded}>
                        <IconButton {...row.getToggleRowExpandedProps()} size="small">
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </RowCustomExpandedSpan>
                )
                : null),
            width: '20px',
        },
        {
            Header: translate('Component.HistoryTable.Header.ProcessName'),
            accessor: ({ process }) => process?.name,
            width: '25%',
        },
        {
            Header: translate('Component.HistoryTable.Header.Status'),
            accessor: 'status',
            width: '200px',
            Cell: ({ value }) => {
                const formattedStatus = capitalizeFirstLetter({ text: value, lowerCaseRest: true, delimiter: /_| / });
                return (
                    <Label color={getProcessInstanceStatusColor(value)}>
                        {/* @ts-ignore */}
                        {translate(`Component.HistoryTable.Status.${formattedStatus}`)}
                    </Label>
                );
            },
        },
        {
            Header: translate('Component.HistoryTable.Header.Started'),
            accessor: 'created',
            width: '200px',
            Cell: ({ value }) => (value ? moment(value).format('DD/MM/yyyy HH:mm:ss') : ''),
        },
        {
            Header: translate('Component.HistoryTable.Header.Finished'),
            accessor: 'updated',
            width: '200px',
            Cell: ({ value }) => (value ? moment(value).format('DD/MM/yyyy HH:mm:ss') : ''),
        },
        {
            Header: translate('Component.HistoryTable.Header.Bot'),
            accessor: ({ bot }) => bot?.installationId,
            featureKeys: [FeatureKey.PROCESS_INSTANCE_HISTORY_DETAIL_VIEW],
        },
        {
            Header: translate('Component.HistoryTable.Header.Initiator'),
            accessor: ({ user, scheduled }) => (scheduled ? translate('Component.HistoryTable.Rows.Initiator', { login: user.login }) : user?.login),
        },
    ];

    const accessedColumns = columns.filter((column) => (column.featureKeys ? hasFeatureKeyAccess(user, column.featureKeys) : true));

    return accessedColumns;
};

export default useProcessInstanceColumns;
