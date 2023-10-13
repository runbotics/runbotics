import { useContext, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { IProcessInstance, WsMessage } from 'runbotics-common';

import { SocketContext } from '#src-app/providers/Socket.provider';
import { processInstanceSelector, processInstanceActions } from '#src-app/store/slices/ProcessInstance';

const useProcessInstanceMapSocket = () => {
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const processInstanceState = useSelector(processInstanceSelector);

    useEffect(() => {
        socket.on(WsMessage.PROCESS, (processInstance: IProcessInstance) => {
            dispatch(processInstanceActions.updateActiveProcessInstanceMap(processInstance));
        });

        return () => {
            socket.off(WsMessage.PROCESS);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, processInstanceState.allActiveMap]);
};

export default useProcessInstanceMapSocket;
