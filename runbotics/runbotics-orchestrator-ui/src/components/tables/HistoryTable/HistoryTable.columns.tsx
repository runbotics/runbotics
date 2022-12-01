import React from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import moment from 'moment';
import { FeatureKey } from 'runbotics-common';

import useAuth from 'src/hooks/useAuth';
import useInitiatorLabel from 'src/hooks/useInitiatorLabel';
import useTranslations from 'src/hooks/useTranslations';
import { capitalizeFirstLetter } from 'src/utils/text';

import { getProcessInstanceStatusColor } from '../../../utils/getProcessInstanceStatusColor';
import Label from '../../Label';
import { hasFeatureKeyAccess } from '../../utils/Secured';
import { Column, RowCustomExpandedSpan } from '../Table';

const useProcessInstanceColumns = (): Column[] => {
    const { translate } = useTranslations();
    const { user: authUser } = useAuth();
    const { mapInitiatorLabel } = useInitiatorLabel();

    const columns = [
        {
            Header: ' ',
            id: 'expander',
            Cell: ({ row }) =>
                row.original.subProcesses && row.original.subProcesses.length > 0 ? (
                    <RowCustomExpandedSpan isExpanded={row.isExpanded}>
                        <IconButton {...row.getToggleRowExpandedProps()} size="small">
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </RowCustomExpandedSpan>
                ) : null,
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
            accessor: ({ user, trigger, triggeredBy }) => mapInitiatorLabel({ user, trigger, triggeredBy }),
        },
    ];

    const accessedColumns = columns.filter((column) =>
        column.featureKeys ? hasFeatureKeyAccess(authUser, column.featureKeys) : true,
    );

    return accessedColumns;
};

export default useProcessInstanceColumns;
