import React, { useEffect } from 'react';
import { Row } from 'react-table';
import cronstrue from 'cronstrue/i18n';
import { Stack, TableCell } from '@mui/material';
import { useSelector, useDispatch } from 'src/store';
import { schedulerActions, schedulerSelector, ScheduledJob, SchedulerJob } from 'src/store/slices/Scheduler';
import useScheduledStatusSocket from 'src/hooks/useScheduledStatusSocket';
import InternalPage from 'src/components/pages/InternalPage';
import { DataTableRow } from 'src/components/Table';
import useTranslations from 'src/hooks/useTranslations';
import { IProcessInstance } from 'runbotics-common';
import i18n from 'i18next';
import Header from './Header';
import SchedulerTableContainer from './SchedulerTable.container';
import {
    useActiveProcessColumns,
    useScheduledProcessColumns,
    useWaitingProcessColumns,
} from './SchedulerTable.columns';
import { useRouter } from 'next/router';

const SchedulerView = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { translate } = useTranslations();
    const { scheduledJobs, activeJobs, waitingJobs } = useSelector(schedulerSelector);
    useScheduledStatusSocket();

    useEffect(() => {
        dispatch(schedulerActions.getActiveJobs());
        dispatch(schedulerActions.getScheduledJobs());
        dispatch(schedulerActions.getWaitingJobs());
    }, []);

    const activeProcessColumns = useActiveProcessColumns();
    const waitingProcessColumns = useWaitingProcessColumns();
    const scheduledProcessColumns = useScheduledProcessColumns();

    const handleProcessInstanceRedirect = (rowData: IProcessInstance) => {
        if (rowData.process) {
            router.push(`/app/processes/${rowData.process.id}/build`);
        }
    };

    const handleSchedulerJobRedirect = (rowData: SchedulerJob) => {
        if (rowData.data.process) {
            router.push(`/app/processes/${rowData.data.process.id}/build`);
        }
    };

    const handleScheduledJobRedirect = (rowData: ScheduledJob) => {
        router.push(`/app/processes/${rowData.process.id}/build`);
    };

    const renderScheduledJobSubRow = (row: Row<ScheduledJob>) => {
        const humanReadableCron = (cronExpression: string) =>
            translate('Scheduler.ScheduledProcess.Table.Rows.Cron.HumanReadable', {
                cron: cronstrue.toString(cronExpression, { locale: i18n.language }).toLowerCase(),
            });

        return (
            <DataTableRow isSubRoww>
                <TableCell colSpan={row.cells.length}>{humanReadableCron(row.original.cron)}</TableCell>
            </DataTableRow>
        );
    };

    return (
        <InternalPage
            title={translate('Scheduler.Meta.Title')}
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
            <Header />
            <Stack spacing={3}>
                <SchedulerTableContainer<IProcessInstance>
                    columns={activeProcessColumns}
                    title={translate('Scheduler.View.ActiveProcesses.Title')}
                    processes={activeJobs}
                    onRedirect={handleProcessInstanceRedirect}
                />
                <SchedulerTableContainer<SchedulerJob>
                    columns={waitingProcessColumns}
                    title={translate('Scheduler.View.PendingProcesses.Title')}
                    processes={waitingJobs}
                    onRedirect={handleSchedulerJobRedirect}
                />
                <SchedulerTableContainer<ScheduledJob>
                    columns={scheduledProcessColumns}
                    title={translate('Scheduler.View.ScheduledProcesses.Title')}
                    processes={scheduledJobs}
                    onRedirect={handleScheduledJobRedirect}
                    renderSubRow={renderScheduledJobSubRow}
                />
            </Stack>
        </InternalPage>
    );
};

export default SchedulerView;
