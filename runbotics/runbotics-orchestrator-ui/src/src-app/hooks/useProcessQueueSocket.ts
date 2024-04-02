import { useContext, useEffect } from 'react';

import { WsQueueMessage, WsMessage } from 'runbotics-common';

import { SocketContext } from '#src-app/providers/Socket.provider';
import { useDispatch } from '#src-app/store';
import { processInstanceActions } from '#src-app/store/slices/ProcessInstance';


export const useProcessQueueSocket = () => {
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on(WsMessage.PROCESS_START_COMPLETED, (payload: WsQueueMessage[WsMessage.PROCESS_START_COMPLETED]) => {
            dispatch(processInstanceActions.updateJobsMap({
                eventType: WsMessage.PROCESS_START_COMPLETED,
                ...payload,
            }));
        });

        socket.on(WsMessage.PROCESS_START_FAILED, (payload: WsQueueMessage[WsMessage.PROCESS_START_FAILED]) => {
            dispatch(processInstanceActions.updateJobsMap({
                eventType: WsMessage.PROCESS_START_FAILED,
                ...payload,
            }));
        });

        socket.on(WsMessage.JOB_REMOVE_COMPLETED, (payload: WsQueueMessage[WsMessage.JOB_REMOVE_COMPLETED]) => {
            dispatch(processInstanceActions.updateJobsMap({
                eventType: WsMessage.JOB_REMOVE_COMPLETED,
                ...payload,
            }));
        });

        socket.on(WsMessage.JOB_REMOVE_FAILED, (payload: WsQueueMessage[WsMessage.JOB_REMOVE_FAILED]) => {
            dispatch(processInstanceActions.updateJobsMap({
                eventType: WsMessage.JOB_REMOVE_FAILED,
                ...payload,
            }));
        });

        socket.on(WsMessage.JOB_WAITING, (payload: WsQueueMessage[WsMessage.JOB_WAITING]) => {
            dispatch(processInstanceActions.updateJobsMap({
                eventType: WsMessage.JOB_WAITING,
                ...payload,
            }));
        });

        socket.on(WsMessage.JOB_ACTIVE, (payload: WsQueueMessage[WsMessage.JOB_ACTIVE]) => {
            dispatch(processInstanceActions.updateJobsMap({
                eventType: WsMessage.JOB_ACTIVE,
                ...payload,
            }));
        });

        socket.on(WsMessage.JOB_FAILED, (payload: WsQueueMessage[WsMessage.JOB_FAILED]) => {
            dispatch(processInstanceActions.updateJobsMap({
                eventType: WsMessage.JOB_FAILED,
                ...payload,
            }));
        });

        return () => {
            socket.off(WsMessage.PROCESS_START_COMPLETED);
            socket.off(WsMessage.PROCESS_START_FAILED);
            socket.off(WsMessage.JOB_REMOVE_COMPLETED);
            socket.off(WsMessage.JOB_REMOVE_FAILED);
            socket.off(WsMessage.JOB_WAITING);
            socket.off(WsMessage.JOB_ACTIVE);
            socket.off(WsMessage.JOB_FAILED);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
};
