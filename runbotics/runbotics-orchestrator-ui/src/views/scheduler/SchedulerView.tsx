import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row } from 'react-table';
import cronstrue from 'cronstrue/i18n';
import { Stack, TableCell } from '@mui/material';
import { useSelector, useDispatch } from 'src/store';
import {
    schedulerActions, schedulerSelector, ScheduledJob, SchedulerJob,
} from 'src/store/slices/Scheduler';
import useScheduledStatusSocket from 'src/hooks/useScheduledStatusSocket';
import InternalPage from 'src/components/pages/InternalPage';
import { DataTableRow } from 'src/components/Table';
import useTranslations from 'src/hooks/useTranslations';
import { IProcessInstance } from 'runbotics-common';
import Header from './Header';
import SchedulerTableContainer from './SchedulerTable.container';
import { activeProcessColumns, scheduledProcessColumns, waitingProcessColumns } from './SchedulerTable.columns';
import { Column } from 'react-table';
import moment from 'moment'

const SchedulerView = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { translate } = useTranslations();
    const { scheduledJobs, activeJobs, waitingJobs } = useSelector(schedulerSelector);
    const [columnsActive, setColumnsActive] = React.useState<Column<IProcessInstance>[] >([])
    const [columnsWaiting, setColumnsWaiting] = React.useState<Column<SchedulerJob>[] >([])
    const [columnsScheduled, setColumnsScheduled] = React.useState<Column<ScheduledJob>[] >([])
    useScheduledStatusSocket();

    useEffect(() => {
        dispatch(schedulerActions.getActiveJobs());
        dispatch(schedulerActions.getScheduledJobs());
        dispatch(schedulerActions.getWaitingJobs());
    }, []);

    const prepareActiveProcessColumns = async () => {
        const columns = await activeProcessColumns()
        setColumnsActive(columns)
    }

    const prepareWaitingProcessColumns = async () => {
        const columns = await waitingProcessColumns()
        setColumnsWaiting(columns)
    }
    
    const prepareScheduledProcessColumns = async () => {
        const columns = await scheduledProcessColumns()
        setColumnsScheduled(columns)
    }

    useEffect(() => {
        prepareActiveProcessColumns()
        prepareWaitingProcessColumns();
        prepareScheduledProcessColumns()
    }, [moment.locale()]); 

    const handleProcessInstanceRedirect = (rowData: IProcessInstance) => {
        if (rowData.process) {
            history.push(`/app/processes/${rowData.process.id}/build`);
        }
    };

    const handleSchedulerJobRedirect = (rowData: SchedulerJob) => {
        if (rowData.data.process) {
            history.push(`/app/processes/${rowData.data.process.id}/build`);
        }
    };

    const handleScheduledJobRedirect = (rowData: ScheduledJob) => {
        history.push(`/app/processes/${rowData.process.id}/build`);
    };

    const renderScheduledJobSubRow = (row: Row<ScheduledJob>) => {
        const humanReadableCron = (cronExpression: string) =>
            translate('Scheduler.ScheduledProcess.Table.Rows.Cron.HumanReadable', {
                cron: cronstrue
                .toString(cronExpression, {locale: moment.locale()}).toLowerCase()
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
                    columns={columnsActive}
                    title={translate('Scheduler.View.ActiveProcesses.Title')}
                    processes={activeJobs}
                    onRedirect={handleProcessInstanceRedirect}
                />
                <SchedulerTableContainer<SchedulerJob>
                    columns={columnsWaiting}
                    title={translate('Scheduler.View.PendingProcesses.Title')}
                    processes={waitingJobs}
                    onRedirect={handleSchedulerJobRedirect}
                />
                <SchedulerTableContainer<ScheduledJob>
                    columns={columnsScheduled}
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
