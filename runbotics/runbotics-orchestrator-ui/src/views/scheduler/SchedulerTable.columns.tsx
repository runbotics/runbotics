import React from 'react';
import { CircularProgress } from '@mui/material';
import moment from 'moment';
import { translate } from 'src/hooks/useTranslations';
import { ScheduledJob, SchedulerJob } from 'src/store/slices/Scheduler/Scheduler.state';
import { Column } from 'react-table';
import { IProcessInstance } from 'runbotics-common';
import DeleteScheduleButton from './DeleteScheduleButton';
import DeleteWaitingJobButton from './DeleteWaitingJobButton';
import TerminateProcessButton from './TerminateProcessButton';

export const activeProcessColumns: Column<IProcessInstance>[] = [
    {
        Header: translate('Scheduler.ActiveProcess.Table.Header.Id'),
        width: '22%',
        accessor: ({ id }) => id,
    },
    {
        Header: translate('Scheduler.ActiveProcess.Table.Header.Process'),
        accessor: ({ process }) => process.name,
    },
    {
        Header: translate('Scheduler.ActiveProcess.Table.Header.Bot'),
        accessor: ({ bot }) => `${bot != null
            ? bot.installationId
            : translate('Scheduler.ActiveProcess.Table.Rows.Bot.Deleted')}`,
    },
    {
        Header: translate('Scheduler.ActiveProcess.Table.Header.Step'),
        accessor: ({ step }) => (step ? `${step}` : ''),
    },
    {
        Header: translate('Scheduler.ActiveProcess.Table.Header.StartTime'),
        width: '20%',
        accessor: ({ created }) => moment(created).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
        Header: translate('Scheduler.ActiveProcess.Table.Header.Initiator'),
        width: '15%',
        accessor: ({ user, scheduled }) => (scheduled
            ? translate('Scheduler.ActiveProcess.Table.Rows.Initiator.Login', { login: user.login })
            : user.login),
    },
    {
        Header: ' ',
        width: '20px',
        Cell: ({ row }) => (row.original.id ? (
            <TerminateProcessButton id={row.original.id} processName={row.original.process.name} />
        ) : null),
    },
];

export const waitingProcessColumns: Column<SchedulerJob>[] = [
    {
        Header: translate('Scheduler.WaitingProcess.Table.Header.JobId'),
        width: '8%',
        accessor: ({ data }) => data.id,
    },
    {
        Header: translate('Scheduler.WaitingProcess.Table.Header.Process'),
        accessor: ({ data }) => data.process.name,
    },
    {
        Header: translate('Scheduler.WaitingProcess.Table.Header.BotCollection'),
        accessor: ({ data }) => `${data.process.botCollection.name}`,
    },
    {
        Header: translate('Scheduler.WaitingProcess.Table.Header.BotType'),
        accessor: ({ data }) => `${data.process.system.name}`,
    },
    {
        Header: translate('Scheduler.WaitingProcess.Table.Header.Initiator'),
        accessor: ({ data }) => (data.cron
            ? translate('Scheduler.WaitingProcess.Table.Rows.Initiator.Login', { login: data.user.login })
            : data.user.login),
    },
    {
        Header: ' ',
        width: '20px',
        Cell: ({ row }) => (!row.original.data.isActive ? (
            <DeleteWaitingJobButton id={row.original.id} processName={row.original.data.process.name} />
        ) : (
            <CircularProgress size="1.5rem" />
        )),
    },
];

export const scheduledProcessColumns: Column<ScheduledJob>[] = [
    {
        Header: translate('Scheduler.ScheduledProcess.Table.Header.JobId'),
        width: '8%',
        accessor: ({ id }) => id,
    },
    {
        Header: translate('Scheduler.ScheduledProcess.Table.Header.Process'),
        accessor: ({ process }) => process.name,
    },
    {
        Header: translate('Scheduler.ScheduledProcess.Table.Header.BotCollection'),
        accessor: ({ process }) => `${process.botCollection.name}`,
    },
    {
        Header: translate('Scheduler.ScheduledProcess.Table.Header.BotType'),
        accessor: ({ process }) => `${process.system.name}`,
    },
    {
        Header: translate('Scheduler.ScheduledProcess.Table.Header.Initiator'),
        accessor: ({ process, next, cron }) => (next || cron
            ? translate('Scheduler.ScheduledProcess.Table.Rows.Initiator.Login', { login: process.createdBy.login })
            : process.createdBy.login),
    },
    {
        Header: ' ',
        width: '20px',
        Cell: ({ row }) => (row.original.id ? (
            <DeleteScheduleButton id={row.original.id} processName={row.original.process.name} />
        ) : null),
    },
];
