import { useContext, useEffect } from 'react';

import { WsQueueMessage, WsMessage } from 'runbotics-common';

import { SocketContext } from '#src-app/providers/Socket.provider';
import { useDispatch } from '#src-app/store';
import { processInstanceActions } from '#src-app/store/slices/ProcessInstance';


export const useProcessQueueSocket = () => {
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on(WsMessage.PROCESS_STARTED, (payload: WsQueueMessage[WsMessage.PROCESS_STARTED]) => {
            dispatch(processInstanceActions.updateJobsMap({
                eventType: WsMessage.PROCESS_STARTED,
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
            socket.off(WsMessage.PROCESS_STARTED);
            socket.off(WsMessage.JOB_WAITING);
            socket.off(WsMessage.JOB_ACTIVE);
            socket.off(WsMessage.JOB_FAILED);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
};
