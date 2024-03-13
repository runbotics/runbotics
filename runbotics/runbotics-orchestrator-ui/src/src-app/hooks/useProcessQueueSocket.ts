import { useContext, useEffect } from 'react';

import { ProcessQueueMessage, WsMessage } from 'runbotics-common';

import { SocketContext } from '#src-app/providers/Socket.provider';

interface Props {
  onCompleted: (payload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED]) => void;
  onFailed: (payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED]) => void;
}

export const useProcessQueueSocket = ({ onCompleted, onFailed }: Props, deps: unknown[]) => {
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on(WsMessage.PROCESS_COMPLETED, (payload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED]) => {
            onCompleted(payload);
        });

        socket.on(WsMessage.PROCESS_FAILED, (payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED]) => {
            onFailed(payload);
        });

        return () => {
            socket.off(WsMessage.PROCESS_COMPLETED);
            socket.off(WsMessage.PROCESS_FAILED);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, ...deps]);
};
