import { useSnackbar } from 'notistack';
import { useContext, useEffect } from 'react';
import {
    IProcessInstance, IProcessInstanceEvent, ProcessInstanceStatus, WsMessage,
} from 'runbotics-common';
import { SocketContext } from 'src/providers/Socket.provider';
import { ScheduledJob, SchedulerJob } from 'src/store/slices/Scheduler/Scheduler.state';
import { useDispatch } from '../store';
import { schedulerActions } from '../store/slices/Scheduler';
import useTranslations from './useTranslations';

const isFinishedStatus = (status: ProcessInstanceStatus) => status === ProcessInstanceStatus.COMPLETED
    || status === ProcessInstanceStatus.ERRORED
    || status === ProcessInstanceStatus.TERMINATED;

export const useScheduledStatusSocket = () => {
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        socket.on(WsMessage.PROCESS, (processInstance: IProcessInstance) => {
            if (processInstance.rootProcessInstanceId) return;

            if (processInstance.status === ProcessInstanceStatus.INITIALIZING) {
                dispatch(schedulerActions.addActiveJob(processInstance));
                return;
            }

            if (isFinishedStatus(processInstance.status))
                dispatch(schedulerActions.removeActiveJob(processInstance));


            if (processInstance.status === ProcessInstanceStatus.TERMINATED)
                enqueueSnackbar(
                    translate('Scheduler.ActiveProcess.Terminate.Success', {
                        processName: processInstance.process.name,
                    }), {
                        variant: 'success',
                    },
                );

        });

        socket.on(WsMessage.REMOVE_WAITING_SCHEDULE, (job: SchedulerJob) => {
            dispatch(schedulerActions.deleteWaitingJob(job));
        });
        socket.on(WsMessage.ADD_WAITING_SCHEDULE, (job: SchedulerJob) => {
            dispatch(schedulerActions.addWaitingJob(job));
        });

        socket.on(WsMessage.REMOVE_SCHEDULE_PROCESS, (job: ScheduledJob) => {
            dispatch(schedulerActions.removeScheduledProcess(job));
        });
        socket.on(WsMessage.ADD_SCHEDULE_PROCESS, (job: ScheduledJob) => {
            dispatch(schedulerActions.addScheduledProcess(job));
        });

        socket.on(WsMessage.PROCESS_INSTANCE_EVENT, (processInstanceEvent: IProcessInstanceEvent) => {
            dispatch(schedulerActions.updateActiveJob(processInstanceEvent));
        });

        return () => {
            socket.off(WsMessage.REMOVE_SCHEDULE_PROCESS);
            socket.off(WsMessage.ADD_SCHEDULE_PROCESS);
            socket.off(WsMessage.PROCESS_INSTANCE_EVENT);
            socket.off(WsMessage.REMOVE_SCHEDULE_PROCESS);
            socket.off(WsMessage.ADD_WAITING_SCHEDULE);
            socket.off(WsMessage.PROCESS);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
};

export default useScheduledStatusSocket;
