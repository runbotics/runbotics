import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IProcessInstance, IProcessInstanceEvent, WsMessage, ProcessInstanceStatus } from 'runbotics-common';
import { SocketContext } from 'src/providers/Socket.provider';
import { processSelector } from 'src/store/slices/Process';
import { processInstanceActions, processInstanceSelector } from 'src/store/slices/ProcessInstance';

interface ProcessInstanceSocketHookProps {
    orchestratorProcessInstanceId?: string | null;
    fullHistoryUpdate?: boolean;
}

const isProcessInstanceFinished = (processInstance: IProcessInstance) =>
    processInstance.status === ProcessInstanceStatus.COMPLETED ||
    processInstance.status === ProcessInstanceStatus.ERRORED;

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
                !!orchestratorProcessInstanceId &&
                processInstance.orchestratorProcessInstanceId === orchestratorProcessInstanceId
            )
                dispatch(processInstanceActions.updateProcessInstance(processInstance));

            if (
                !processInstance.rootProcessInstanceId &&
                (fullHistoryUpdate || Number(processInstance.process.id) === processState.draft.process.id)
            ) {
                dispatch(processInstanceActions.insert(processInstance));
                if (isProcessInstanceFinished(processInstance))
                    dispatch(
                        processInstanceActions.getProcessInstanceAndUpdatePage({
                            processInstanceId: processInstance.id,
                        }),
                    );
            }
        });

        socket.on(WsMessage.PROCESS_INSTANCE_EVENT, (processInstanceEvent: IProcessInstanceEvent) => {
            // eslint-disable-next-line max-len
            if (
                processInstanceEvent.processInstance.orchestratorProcessInstanceId ===
                processInstanceState.active.orchestratorProcessInstanceId
            )
                dispatch(processInstanceActions.updateSingleActiveEvent(processInstanceEvent));
        });

        return () => {
            socket.off(WsMessage.PROCESS);
            socket.off(WsMessage.PROCESS_INSTANCE_EVENT);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, orchestratorProcessInstanceId, processInstanceState.active.processInstance]);
};

export default useProcessInstanceSocket;
