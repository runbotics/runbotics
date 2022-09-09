import React from 'react';
import moment from 'moment';
import { CircularProgress, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { translate, isNamespaceLoaded } from 'src/hooks/useTranslations';
import { ScheduledJob, SchedulerJob } from 'src/store/slices/Scheduler/Scheduler.state';
import { Column } from 'react-table';
import { IProcessInstance } from 'runbotics-common';
import { RowCustomExpandedSpan } from 'src/components/Table';
import DeleteScheduleButton from './DeleteScheduleButton';
import DeleteWaitingJobButton from './DeleteWaitingJobButton';
import TerminateProcessButton from './TerminateProcessButton';

export const activeProcessColumns = async (): Promise<Column<IProcessInstance>[]> => {
    try{
        await isNamespaceLoaded()

    return ([{
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
        accessor: ({ bot }) =>
            `${bot != null ? bot.installationId : translate('Scheduler.ActiveProcess.Table.Rows.Bot.Deleted')}`,
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
        accessor: ({ user, scheduled }) =>
            scheduled
                ? translate('Scheduler.ActiveProcess.Table.Rows.Initiator.Login', { login: user.login })
                : user.login,
    },
    {
        Header: ' ',
        id: 'button',
        width: '20px',
        Cell: ({ row }) =>
            row.original.id ? (
                <TerminateProcessButton id={row.original.id} processName={row.original.process.name} />
            ) : null,
    },])
    } catch(err){
        throw new Error(err)
    }
    
}

export const waitingProcessColumns = async (): Promise<Column<SchedulerJob>[]> => {
    try {
        await isNamespaceLoaded();
    
        return[
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
               Header: translate('Scheduler.WaitingProcess.Table.Header.BotSystem'),
               accessor: ({ data }) => `${data.process.system.name}`,
           },
           {
               Header: translate('Scheduler.WaitingProcess.Table.Header.Initiator'),
               accessor: ({ data }) =>
                   data.cron
                       ? translate('Scheduler.WaitingProcess.Table.Rows.Initiator.Login', { login: data.user.login })
                       : data.user.login,
           },
           {
               Header: ' ',
               id: 'button',
               width: '20px',
               Cell: ({ row }) =>
                   !row.original.data.isActive ? (
                       <DeleteWaitingJobButton id={row.original.id} processName={row.original.data.process.name} />
                   ) : (
                       <CircularProgress size="1.5rem" />
                   ),
           },
       ];
    } catch (err) {
        throw new Error(err);
    }
}

export const scheduledProcessColumns = async (): Promise<Column<ScheduledJob>[]> => {
    try {
        await isNamespaceLoaded()

        return [
            {
                Header: ' ',
                id: 'expander',
                Cell: ({ row }) =>
                    row.original.cron ? (
                        <RowCustomExpandedSpan isExpanded={row.isExpanded}>
                            <IconButton {...row.getToggleRowExpandedProps()} size="small">
                                <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                        </RowCustomExpandedSpan>
                    ) : null,
                width: '20px',
            },
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
                Header: translate('Scheduler.ScheduledProcess.Table.Header.BotSystem'),
                accessor: ({ process }) => `${process.system.name}`,
            },
            {
                Header: translate('Scheduler.ScheduledProcess.Table.Header.Initiator'),
                accessor: ({ user, next, cron }) =>
                    next || cron
                        ? translate('Scheduler.ScheduledProcess.Table.Rows.Initiator.Login', { login: user.login })
                        : user.login,
            },
            {
                Header: ' ',
                id: 'button',
                width: '20px',
                Cell: ({ row }) =>
                    row.original.id ? (
                        <DeleteScheduleButton id={row.original.id} processName={row.original.process.name} />
                    ) : null,
            },
        ]
        
    } catch(err){
        throw new Error(err)
    }
} 
