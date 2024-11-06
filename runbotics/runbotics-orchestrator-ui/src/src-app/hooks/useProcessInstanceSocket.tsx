import { useContext, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { IProcessInstance, IProcessInstanceEvent, WsMessage, isProcessInstanceFinished, IProcessInstanceLoopEvent } from 'runbotics-common';

import { SocketContext } from '#src-app/providers/Socket.provider';
import { processSelector } from '#src-app/store/slices/Process';
import { processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
import { processInstanceEventActions } from '#src-app/store/slices/ProcessInstanceEvent';

interface ProcessInstanceSocketHookProps {
    orchestratorProcessInstanceId?: string | null;
    fullHistoryUpdate?: boolean;
}

const useProcessInstanceSocket = ({
    orchestratorProcessInstanceId,
    fullHistoryUpdate,
}: ProcessInstanceSocketHookProps) => {
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const processInstanceState = useSelector(processInstanceSelector);
    const processState = useSelector(processSelector);

    useEffect(() => {
        socket.on(WsMessage.PROCESS, (processInstance: IProcessInstance) => {
            if (
                !!orchestratorProcessInstanceId
                && processInstance.orchestratorProcessInstanceId === orchestratorProcessInstanceId
            ) {
                dispatch(processInstanceActions.updateActiveProcessInstance(processInstance));
            }

            if (
                !processInstance.rootProcessInstanceId
                && (fullHistoryUpdate || Number(processInstance.process.id) === processState.draft.process.id)
            ) {
                dispatch(processInstanceActions.insert(processInstance));
                if (isProcessInstanceFinished(processInstance.status)) {
                    dispatch(
                        processInstanceActions.getProcessInstanceAndUpdatePage({
                            resourceId: processInstance.id,
                        }),
                    );
                }
            }
        });

        socket.on(WsMessage.PROCESS_INSTANCE_EVENT, (processInstanceEvent: IProcessInstanceEvent) => {
            // eslint-disable-next-line max-len
            if (
                processInstanceEvent.processInstance.orchestratorProcessInstanceId ===
                processInstanceState.active.orchestratorProcessInstanceId
            )
            { dispatch(processInstanceActions.updateSingleActiveEvent(processInstanceEvent)); }
        });

        socket.on(WsMessage.PROCESS_INSTANCE_LOOP_EVENT, (processInstanceLoopEvent: IProcessInstanceLoopEvent) => {
            if (
                processInstanceLoopEvent.processInstance.orchestratorProcessInstanceId ===
                processInstanceState.active.orchestratorProcessInstanceId
            )
            { dispatch(processInstanceEventActions.updateSingleActiveLoopEvent(processInstanceLoopEvent)); }
        });

        return () => {
            socket.off(WsMessage.PROCESS);
            socket.off(WsMessage.PROCESS_INSTANCE_EVENT);
            socket.off(WsMessage.PROCESS_INSTANCE_LOOP_EVENT);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, orchestratorProcessInstanceId, processInstanceState.active.processInstance]);
};

export default useProcessInstanceSocket;
