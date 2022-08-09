import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import { useSelector, useDispatch } from 'src/store';
import {
    schedulerActions, schedulerSelector, ScheduledJob, SchedulerJob,
} from 'src/store/slices/Scheduler';
import useScheduledStatusSocket from 'src/hooks/useScheduledStatusSocket';
import InternalPage from 'src/components/pages/InternalPage';
import useTranslations from 'src/hooks/useTranslations';
import { IProcessInstance } from 'runbotics-common';
import Header from './Header';
import SchedulerTableContainer from './SchedulerTable.container';
import { activeProcessColumns, scheduledProcessColumns, waitingProcessColumns } from './SchedulerTable.columns';

const SchedulerView = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { scheduledJobs, activeJobs, waitingJobs } = useSelector(schedulerSelector);
    useScheduledStatusSocket();

    useEffect(() => {
        dispatch(schedulerActions.getActiveJobs());
        dispatch(schedulerActions.getScheduledJobs());
        dispatch(schedulerActions.getWaitingJobs());
    }, []);

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
                />
                <SchedulerTableContainer<SchedulerJob>
                    columns={waitingProcessColumns}
                    title={translate('Scheduler.View.PendingProcesses.Title')}
                    processes={waitingJobs}
                />
                <SchedulerTableContainer<ScheduledJob>
                    columns={scheduledProcessColumns}
                    title={translate('Scheduler.View.ScheduledProcesses.Title')}
                    processes={scheduledJobs}
                />
            </Stack>
        </InternalPage>
    );
};

export default SchedulerView;
