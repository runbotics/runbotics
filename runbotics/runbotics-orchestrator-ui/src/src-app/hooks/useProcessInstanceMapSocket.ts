import { useContext, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import {
    ProcessInstanceStatus, IProcessInstance,
    WsMessage, Role
} from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';
import { SocketContext } from '#src-app/providers/Socket.provider';
import { useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';

const useProcessInstanceMapSocket = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const { allActiveMap }= useSelector(processInstanceSelector);

    useEffect(() => {
        socket.on(WsMessage.PROCESS, (processInstance: IProcessInstance) => {
            const processId = processInstance?.process?.id;
            const isAdminOrOwner =
                user.roles.some(role => role === Role.ROLE_TENANT_ADMIN) ||
                processInstance.user.id === user.id;
            const canUpdateProcessInstance =
                !allActiveMap[processId] ||
                allActiveMap[processId]?.processInstance?.id === processInstance?.id ||
                allActiveMap[processId]?.processInstance?.status !== ProcessInstanceStatus.IN_PROGRESS;

            if (
                allActiveMap[processId]?.processInstance?.status !== ProcessInstanceStatus.IN_PROGRESS &&
                processInstance.status === ProcessInstanceStatus.IN_PROGRESS
            ) {
                dispatch(processActions.updateProcessPage({
                    id: processInstance.process.id,
                    lastRun: processInstance?.process?.lastRun,
                }));
            }

            if (canUpdateProcessInstance && isAdminOrOwner) {
                dispatch(processInstanceActions.updateActiveProcessInstanceMap(processInstance));
            }
        });

        return () => {
            socket.off(WsMessage.PROCESS);
        };

    }, [socket, allActiveMap, user, dispatch]);
};

export default useProcessInstanceMapSocket;
