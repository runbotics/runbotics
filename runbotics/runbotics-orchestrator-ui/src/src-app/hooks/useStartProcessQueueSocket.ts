import { useContext, useEffect } from 'react';

import { ProcessQueueMessage, WsMessage } from 'runbotics-common';

import { SocketContext } from '#src-app/providers/Socket.provider';

interface UseStartProcessQueueSocketParams {
  onWaiting: (payload: ProcessQueueMessage[WsMessage.PROCESS_WAITING]) => void;
  onProcessing: (payload: ProcessQueueMessage[WsMessage.PROCESS_PROCESSING]) => void;
  onCompleted: (payload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED]) => void;
  onFailed: (payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED]) => void;
  onRemoved: (payload: ProcessQueueMessage[WsMessage.PROCESS_REMOVED]) => void;
  onQueueUpdate: (payload: ProcessQueueMessage[WsMessage.PROCESS_QUEUE_UPDATE]) => void;
}

export const useStartProcessQueueSocket = ({
    onWaiting, onProcessing, onCompleted, onFailed, onRemoved, onQueueUpdate
}: UseStartProcessQueueSocketParams) => {
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on(WsMessage.PROCESS_WAITING, (payload: ProcessQueueMessage[WsMessage.PROCESS_WAITING]) => {
            onWaiting(payload);
        });

        socket.on(WsMessage.PROCESS_PROCESSING, (payload: ProcessQueueMessage[WsMessage.PROCESS_PROCESSING]) => {
            onProcessing(payload);
        });

        socket.on(WsMessage.PROCESS_COMPLETED, (payload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED]) => {
            onCompleted(payload);
        });

        socket.on(WsMessage.PROCESS_FAILED, (payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED]) => {
            onFailed(payload);
        });

        socket.on(WsMessage.PROCESS_REMOVED, (payload: ProcessQueueMessage[WsMessage.PROCESS_REMOVED]) => {
            onRemoved(payload);
        });

        socket.on(WsMessage.PROCESS_QUEUE_UPDATE, (payload: ProcessQueueMessage[WsMessage.PROCESS_QUEUE_UPDATE]) => {
            onQueueUpdate(payload);
        })

        return () => {

            socket.off(WsMessage.PROCESS_WAITING);
            socket.off(WsMessage.PROCESS_PROCESSING);
            socket.off(WsMessage.PROCESS_COMPLETED);
            socket.off(WsMessage.PROCESS_FAILED);
            socket.off(WsMessage.PROCESS_REMOVED);
            socket.off(WsMessage.PROCESS_QUEUE_UPDATE);
        };
    }, [socket]);
};

export default useStartProcessQueueSocket;
