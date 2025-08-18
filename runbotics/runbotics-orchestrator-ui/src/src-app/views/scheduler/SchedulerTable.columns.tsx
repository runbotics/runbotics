import { CircularProgress } from '@mui/material';
import moment from 'moment';

import { IProcessInstance } from 'runbotics-common';

import { Column } from '#src-app/components/tables/Table';
import TableRowExpander from '#src-app/components/tables/Table/components/TableRowExpander';
import useInitiatorLabel from '#src-app/hooks/useInitiatorLabel';
import useTranslations from '#src-app/hooks/useTranslations';
import {
    QueueJob,
    ScheduledJob,
} from '#src-app/store/slices/Scheduler/Scheduler.state';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import Checkbox from '#src-landing/components/Checkbox';

import DeleteScheduleButton from './DeleteScheduleButton';
import DeleteWaitingJobButton from './DeleteWaitingJobButton';
import TerminateProcessButton from './TerminateProcessButton';

export const useActiveProcessColumns = (): Column<IProcessInstance>[] => {
    const { translate } = useTranslations();
    const { mapInitiatorLabel } = useInitiatorLabel();

    return [
        {
            Header: translate('Scheduler.ActiveProcess.Table.Header.Id'),
            width: '20%',
            accessor: ({ id }) => id,
        },
        {
            Header: translate('Scheduler.Common.Process'),
            width: '17%',
            accessor: ({ process }) => process.name,
        },
        {
            Header: translate('Scheduler.ActiveProcess.Table.Header.Bot'),
            width: '10%',
            accessor: ({ bot }) =>
                bot !== null
                    ? bot.installationId
                    : translate(
                        'Scheduler.ActiveProcess.Table.Rows.Bot.Deleted'
                    ),
        },
        {
            Header: translate('Scheduler.ActiveProcess.Table.Header.Step'),
            accessor: ({ step }) =>
                step
                    ? // @ts-ignore
                    translate(
                        `Process.Details.Modeler.Actions.${capitalizeFirstLetter(
                            {
                                text: step,
                                delimiter: '.',
                                join: '.',
                            }
                        )}.Label`
                    )
                    : '',
        },
        {
            Header: translate('Scheduler.ActiveProcess.Table.Header.StartTime'),
            width: '12%',
            accessor: ({ created }) =>
                moment(created).format('DD/MM/YYYY HH:mm:ss'),
        },
        {
            Header: translate('Scheduler.ActiveProcess.Table.Header.Initiator'),
            width: '20%',
            accessor: ({ user, trigger, triggerData }) =>
                mapInitiatorLabel({ user, trigger, triggerData }),
        },
        {
            Header: ' ',
            id: 'button',
            width: '70px',
            Cell: ({ row }) =>
                row.original.id ? (
                    <TerminateProcessButton
                        id={row.original.id}
                        processName={row.original.process.name}
                    />
                ) : null,
        },
    ];
};

export const useWaitingProcessColumns = (): Column<QueueJob>[] => {
    const { translate } = useTranslations();
    const { mapInitiatorLabel } = useInitiatorLabel();

    return [
        {
            Header: translate('Scheduler.WaitingProcess.Table.Header.JobId'),
            width: '20%',
            accessor: ({ id }) => id.split(':')[1],
        },
        {
            Header: translate('Scheduler.Common.Process'),
            accessor: ({ data }) => data.process.name,
        },
        {
            Header: translate('Scheduler.Common.BotCollection'),
            width: '20%',
            accessor: ({ data }) => `${data.process.botCollection.name}`,
        },
        {
            Header: translate('Scheduler.Common.BotSystem'),
            width: '10%',
            accessor: ({ data }) => `${data.process.system.name}`,
        },
        {
            Header: translate(
                'Scheduler.WaitingProcess.Table.Header.Initiator'
            ),
            width: '20%',
            accessor: ({ data: { user, trigger, triggerData } }) =>
                mapInitiatorLabel({ user, trigger, triggerData }),
        },
        {
            Header: ' ',
            id: 'button',
            width: '70px',
            Cell: ({ row }) =>
                !row.original.data.isActive ? (
                    <DeleteWaitingJobButton
                        id={row.original.id}
                        processName={row.original.data.process.name}
                    />
                ) : (
                    <CircularProgress size="1.5rem" />
                ),
        },
    ];
};

export const useScheduledProcessColumns = (): Column<ScheduledJob>[] => {
    const { translate } = useTranslations();

    return [
        {
            Header: ' ',
            id: 'expander',
            Cell: ({ row }) =>
                row.original.cron ? <TableRowExpander row={row} /> : null,
            width: '100px',
        },
        {
            Header: translate(
                'Scheduler.ScheduledProcess.Table.Header.ScheduleId'
            ),
            width: '10%',
            accessor: ({ id }) => id,
        },
        {
            Header: translate('Scheduler.Common.Process'),
            accessor: ({ process }) => process.name,
        },
        {
            Header: translate('Scheduler.Common.BotCollection'),
            width: '20%',
            accessor: ({ process }) => process.botCollection.name,
        },
        {
            Header: translate('Scheduler.Common.BotSystem'),
            width: '8%',
            accessor: ({ process }) => process.system.name,
        },
        {
            Header: translate(
                'Scheduler.ScheduledProcess.Table.Header.Creator'
            ),
            accessor: ({ user }) => user?.email,
        },
        {
            Header: translate('Scheduler.ScheduledProcess.Table.Header.Active'),
            accessor: ({ active }) => active,
            Cell: ({ row }) => (
                <Checkbox checked={row.original.active} label={''} />
            ),
        },
        {
            Header: ' ',
            id: 'button',
            width: '70px',
            Cell: ({ row }) =>
                row.original.id ? (
                    <DeleteScheduleButton
                        id={row.original.id}
                        processName={row.original.process.name}
                    />
                ) : null,
        },
    ];
};
