import React, { useEffect } from 'react';

import { Stack, TableCell } from '@mui/material';
import cronstrue from 'cronstrue/i18n';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import { Row } from 'react-table';

import { IProcessInstance } from 'runbotics-common';

import InternalPage from '#src-app/components/pages/InternalPage';
import { DataTableRow } from '#src-app/components/tables/Table';
import useScheduledStatusSocket from '#src-app/hooks/useScheduledStatusSocket';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector, useDispatch } from '#src-app/store';
import {
    schedulerActions,
    schedulerSelector,
    ScheduledJob,
    QueueJob,
} from '#src-app/store/slices/Scheduler';

import { processInstanceStatuses } from '#src-app/store/slices/Scheduler/Scheduler.thunks';

import Header from './Header';
import {
    useActiveProcessColumns,
    useScheduledProcessColumns,
    useWaitingProcessColumns,
} from './SchedulerTable.columns';
import SchedulerTableContainer from './SchedulerTable.container';

const SchedulerView = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { translate } = useTranslations();
    const { scheduledJobs, activeJobs, waitingJobs } =
        useSelector(schedulerSelector);
    useScheduledStatusSocket();

    useEffect(() => {
        dispatch(schedulerActions.getActiveJobs({
            pageParams: {
                filter: {
                    in: {
                        status: processInstanceStatuses,
                    },
                },
            },
        }));
        dispatch(schedulerActions.getScheduledJobs());
        dispatch(schedulerActions.getWaitingJobs());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeProcessColumns = useActiveProcessColumns();
    const waitingProcessColumns = useWaitingProcessColumns();
    const scheduledProcessColumns = useScheduledProcessColumns();

    const handleProcessInstanceRedirect = (rowData: IProcessInstance) => {
        if (rowData.process) router.push(`/app/processes/${rowData.process.id}/build`);
    };

    const handleSchedulerJobRedirect = (rowData: QueueJob) => {
        if (rowData.data.process) router.push(`/app/processes/${rowData.data.process.id}/build`);
    };

    const handleScheduledJobRedirect = (rowData: ScheduledJob) => {
        router.push(`/app/processes/${rowData.process.id}/build`);
    };

    const renderScheduledJobSubRow = (row: Row<ScheduledJob>) => {
        const humanReadableCron = (cronExpression: string) =>
            translate(
                'Scheduler.ScheduledProcess.Table.Rows.Cron.HumanReadable',
                {
                    cron: cronstrue
                        .toString(cronExpression, { locale: i18n.language })
                        .toLowerCase(),
                }
            );

        return (
            <DataTableRow $isSubRow>
                <TableCell colSpan={row.cells.length}>
                    {humanReadableCron(row.original.cron)}
                </TableCell>
            </DataTableRow>
        );
    };

    return (
        <InternalPage
            title={translate('Scheduler.Common.Title')}
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
            <Header />
            <Stack spacing={3}>
                <SchedulerTableContainer<IProcessInstance>
                    columns={activeProcessColumns}
                    title={translate('Scheduler.Common.Jobs.ActiveJobs')}
                    processes={activeJobs}
                    onRedirect={handleProcessInstanceRedirect}
                />
                <SchedulerTableContainer<QueueJob>
                    columns={waitingProcessColumns}
                    title={translate('Scheduler.Common.Jobs.WaitingJobs')}
                    processes={waitingJobs}
                    onRedirect={handleSchedulerJobRedirect}
                />
                <SchedulerTableContainer<ScheduledJob>
                    columns={scheduledProcessColumns}
                    title={translate('Scheduler.Common.Jobs.ScheduledJobs')}
                    processes={scheduledJobs}
                    onRedirect={handleScheduledJobRedirect}
                    renderSubRow={renderScheduledJobSubRow}
                />
            </Stack>
        </InternalPage>
    );
};

export default SchedulerView;
