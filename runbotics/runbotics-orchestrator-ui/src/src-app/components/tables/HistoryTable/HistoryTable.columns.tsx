import React from 'react';

import moment from 'moment';
import { FeatureKey } from 'runbotics-common';

import BotProcessRunner from '#src-app/components/BotProcessRunner';

import useAuth from '#src-app/hooks/useAuth';

import useInitiatorLabel from '#src-app/hooks/useInitiatorLabel';

import useTranslations from '#src-app/hooks/useTranslations';

import { capitalizeFirstLetter } from '#src-app/utils/text';

import { getProcessInstanceStatusColor } from '../../../utils/getProcessInstanceStatusColor';

import Label from '../../Label';

import { hasFeatureKeyAccess } from '../../utils/Secured';

import { Column } from '../Table';
import TableRowExpander from '../Table/TableRowExpander';

const useProcessInstanceColumns = (
    rerunEnabled: boolean,
    onRerunProcess: () => void
): Column[] => {
    const { translate } = useTranslations();
    const { user: authUser } = useAuth();
    const { mapInitiatorLabel } = useInitiatorLabel();

    let columns = [
        {
            Header: ' ',
            id: 'expander',
            Cell: ({ row }) =>
                row.original.subProcesses?.length > 0 ? (
                    <TableRowExpander row={row} />
                ) : null,
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
                const formattedStatus = capitalizeFirstLetter({
                    text: value,
                    lowerCaseRest: true,
                    delimiter: /_| /,
                });
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
            accessor: ({ user, trigger, triggerData }) => mapInitiatorLabel({ user, trigger, triggerData }),
        },
        {
            Header: ' ',
            id: 'rerun-menu',
            width: '70px',
            Cell: ({ row }) =>
                row.depth === 0 ? (
                    <BotProcessRunner
                        process={row.original.process}
                        rerunProcessInstance={row.original}
                        onRunClick={onRerunProcess}
                    />
                ) : null,
            featureKeys: [FeatureKey.PROCESS_START],
        },
    ];

    if (!rerunEnabled) {
        columns = columns.filter(column => column.id !== 'rerun-menu');
    }

    const accessedColumns = columns.filter((column) =>
        column.featureKeys
            ? hasFeatureKeyAccess(authUser, column.featureKeys)
            : true
    );

    return accessedColumns;
};

export default useProcessInstanceColumns;
