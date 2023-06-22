import React from 'react';

import moment from 'moment';
import { useSnackbar } from 'notistack';
import { FeatureKey } from 'runbotics-common';


import BotProcessRunner from '#src-app/components/BotProcessRunner';
import useAuth from '#src-app/hooks/useAuth';
import useInitiatorLabel from '#src-app/hooks/useInitiatorLabel';
import useTranslations from '#src-app/hooks/useTranslations';
import { processInstanceActions } from '#src-app/store/slices/ProcessInstance';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import { useDispatch, useSelector } from '../../../store';
import { getProcessInstanceStatusColor } from '../../../utils/getProcessInstanceStatusColor';
import Label from '../../Label';
import { hasFeatureKeyAccess } from '../../utils/Secured';
import { Column } from '../Table';
import { ProcessInstanceRow, getSubProcessesResponse } from '../Table/Table.types';
import TableRowExpander from '../Table/TableRowExpander';


const useProcessInstanceColumns = (
    rerunEnabled: boolean,
    onRerunProcess: () => void,
): Column[] => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { user: authUser } = useAuth();
    const { mapInitiatorLabel } = useInitiatorLabel();
    const { process: currentProcess } = useSelector(
        (state) => state.process.draft
    );

    const handleNoSubProcessesFound = (currRow: ProcessInstanceRow) => {
        enqueueSnackbar(
            translate('History.Table.Error.SubProcessesNotFound'),
            { variant: 'error' },
        );
        dispatch(processInstanceActions.updateProcessInstance({ id: currRow.original.id, hasSubProcesses: false }));
    };
    
    const handleRowExpand = (currRow: ProcessInstanceRow) => {
        if (currRow.subRows.length > 0 || currRow.isExpanded) return;
        dispatch(processInstanceActions.getSubProcesses({ processInstanceId: currRow.original.id }))
            .then((response: getSubProcessesResponse ) => {
                if(response.payload.length === 0) handleNoSubProcessesFound(currRow);
            })
            .catch(() => { handleNoSubProcessesFound(currRow); });
    };

    let columns = [
        {
            Header: ' ',
            id: 'expander',
            Cell: ({ row }) =>
                row.original.hasSubProcesses ? (
                    <TableRowExpander row={row} handleClick={handleRowExpand} />
                ) : null,
        },
        {
            Header: translate('Component.HistoryTable.Header.ProcessName'),
            accessor: ({ process }) => process?.name,
            width: '25%',
        },
        {
            Header: translate('Component.HistoryTable.Header.Status'),
            accessor: ({ status, warning }) => ({  status: status, warning: warning }),
            width: '200px',
            Cell: ({ value }) => {
                const formattedStatus = capitalizeFirstLetter({
                    text: value.status,
                    lowerCaseRest: true,
                    delimiter: /_| /,
                });

                return (
                    <Label warning={value.warning} color={getProcessInstanceStatusColor(value.status)}>
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
            Cell: ({ value }) =>
                value ? moment(value).format('DD/MM/yyyy HH:mm:ss') : '',
        },
        {
            Header: translate('Component.HistoryTable.Header.Finished'),
            accessor: 'updated',
            width: '200px',
            Cell: ({ value }) =>
                value ? moment(value).format('DD/MM/yyyy HH:mm:ss') : '',
        },
        {
            Header: translate('Component.HistoryTable.Header.Bot'),
            accessor: ({ bot }) => bot?.installationId,
            featureKeys: [FeatureKey.PROCESS_INSTANCE_HISTORY_DETAIL_VIEW],
        },
        {
            Header: translate('Component.HistoryTable.Header.Initiator'),
            accessor: ({ user, trigger, triggerData }) =>
                mapInitiatorLabel({ user, trigger, triggerData }),
        },
        {
            Header: ' ',
            id: 'rerun-menu',
            width: '70px',
            Cell: ({ row }) =>
                row.depth === 0 ? (
                    <BotProcessRunner
                        process={currentProcess}
                        rerunProcessInstance={row.original}
                        onRunClick={onRerunProcess}
                    />
                ) : null,
            featureKeys: [FeatureKey.PROCESS_START],
        },
    ];

    if (!rerunEnabled) {
        columns = columns.filter((column) => column.id !== 'rerun-menu');
    }

    const accessedColumns = columns.filter((column) =>
        column.featureKeys
            ? hasFeatureKeyAccess(authUser, column.featureKeys)
            : true
    );

    return accessedColumns;
};

export default useProcessInstanceColumns;
