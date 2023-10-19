import { useContext, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import {
    ProcessInstanceStatus, IProcessInstance,
    WsMessage, Role
} from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';
import { SocketContext } from '#src-app/providers/Socket.provider';
import { useSelector } from '#src-app/store';
import { processSelector, processActions } from '#src-app/store/slices/Process';
import { processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';

const useProcessInstanceMapSocket = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const { allActiveMap }= useSelector(processInstanceSelector);
    const { all } = useSelector(processSelector);

    const findProcessById = (processId: number) =>
        all.page.content.find((process) => process.id === processId);

    useEffect(() => {
        socket.on(WsMessage.PROCESS, (processInstance: IProcessInstance) => {
            if (
                allActiveMap[processInstance.id]?.processInstance.status
                !== ProcessInstanceStatus.IN_PROGRESS
                &&
                processInstance.status === ProcessInstanceStatus.IN_PROGRESS
            ) {
                const lastRun = (new Date()).toISOString();
                dispatch(processActions.updateProcessPage({
                    ...findProcessById(processInstance.process.id),
                    lastRun
                }));
            }

            if (user.roles.includes(Role.ROLE_ADMIN)
                || processInstance.process.isPublic
                || processInstance.process.createdBy.id === user.id
            ) dispatch(processInstanceActions.updateActiveProcessInstanceMap(processInstance));
        });

        return () => {
            socket.off(WsMessage.PROCESS);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
};

export default useProcessInstanceMapSocket;
