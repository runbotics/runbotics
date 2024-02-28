import { useContext, useEffect } from 'react';

import { ProcessQueueMessage, WsMessage } from 'runbotics-common';

import { SocketContext } from '#src-app/providers/Socket.provider';
import { Job } from '#src-app/store/slices/ProcessInstance/ProcessInstance.state';

interface UseStartProcessQueueSocketParams {
  onWaiting: (payload: ProcessQueueMessage[WsMessage.PROCESS_WAITING]) => void;
  onProcessing: (payload: ProcessQueueMessage[WsMessage.PROCESS_PROCESSING]) => void;
  onCompleted: (payload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED]) => void;
  onFailed: (payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED]) => void;
  onRemoved: (payload: ProcessQueueMessage[WsMessage.PROCESS_REMOVED]) => void;
  onQueueUpdate: (payload: ProcessQueueMessage[WsMessage.PROCESS_QUEUE_UPDATE]) => void;
  job: Job,
  loading: boolean;
}

export const useStartProcessQueueSocket = ({
    onWaiting, onProcessing, onCompleted, onFailed, onRemoved, onQueueUpdate, job, loading,
}: UseStartProcessQueueSocketParams) => {
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on(WsMessage.PROCESS_WAITING, (payload: ProcessQueueMessage[WsMessage.PROCESS_WAITING]) => {
            loading && onWaiting(payload);
        });

        socket.on(WsMessage.PROCESS_PROCESSING, (payload: ProcessQueueMessage[WsMessage.PROCESS_PROCESSING]) => {
            loading && onProcessing(payload);
        });

        socket.on(WsMessage.PROCESS_COMPLETED, (payload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED]) => {
            loading && onCompleted(payload);
        });

        socket.on(WsMessage.PROCESS_FAILED, (payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED]) => {
            loading && onFailed(payload);
        });

        socket.on(WsMessage.PROCESS_REMOVED, (payload: ProcessQueueMessage[WsMessage.PROCESS_REMOVED]) => {
            loading && onRemoved(payload);
        });

        socket.on(WsMessage.PROCESS_QUEUE_UPDATE, (payload: ProcessQueueMessage[WsMessage.PROCESS_QUEUE_UPDATE]) => {
            loading && onQueueUpdate(payload);
        })

        return () => {
            socket.off(WsMessage.PROCESS_WAITING);
            socket.off(WsMessage.PROCESS_PROCESSING);
            socket.off(WsMessage.PROCESS_COMPLETED);
            socket.off(WsMessage.PROCESS_FAILED);
            socket.off(WsMessage.PROCESS_REMOVED);
            socket.off(WsMessage.PROCESS_QUEUE_UPDATE);
        };
    }, [socket, job, loading]);
};

export default useStartProcessQueueSocket;
