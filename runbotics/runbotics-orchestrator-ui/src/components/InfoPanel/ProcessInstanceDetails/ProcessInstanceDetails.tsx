import React, { useEffect, VFC } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { processInstanceActions, processInstanceSelector } from 'src/store/slices/ProcessInstance';
import { Box, CircularProgress } from '@mui/material';
import { ProcessInstanceStatus } from 'runbotics-common';
import ProcessInstanceDetailsTable from './ProcessInstanceDetailsTable';
import ProcessInstanceDetailsHeader from './ProcessInstanceDetailsHeader';

interface ProcessInstanceDetailsProps {
    processInstanceId: string;
}

const ProcessInstanceDetails: VFC<ProcessInstanceDetailsProps> = ({ processInstanceId }) => {
    const dispatch = useDispatch();
    const containerRef = React.useRef<HTMLDivElement>(null);

    const processInstanceState = useSelector(processInstanceSelector);

    const getActiveProcessInstanceIfMatch = () =>
        processInstanceId === processInstanceState.active.processInstance?.id
            ? processInstanceState.active.processInstance
            : processInstanceState.all.byId[processInstanceId];

    const processInstance = processInstanceId
        ? getActiveProcessInstanceIfMatch()
        : processInstanceState.active.processInstance;

    const isProcessFinished =
        processInstance?.status === ProcessInstanceStatus.COMPLETED ||
        processInstance?.status === ProcessInstanceStatus.ERRORED ||
        processInstance?.status === ProcessInstanceStatus.STOPPED;

    useEffect(() => {
        if (processInstanceId) {
            dispatch(processInstanceActions.getProcessInstance({ processInstanceId }));
        }
    }, [processInstanceId]);

    useEffect(
        () => () => {
            if (isProcessFinished) {
                dispatch(processInstanceActions.resetActive());
            }
        },
        [],
    );

    const loading =
        processInstanceState.all.loading ||
        (processInstanceState.active.orchestratorProcessInstanceId &&
            !processInstanceState.active.processInstance &&
            !processInstanceId);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', margin: (theme) => theme.spacing(4) }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (!processInstance) {
        return null;
    }

    return (
        <Box ref={containerRef} display="flex" flexDirection="column" padding="0.625rem" gap="1rem">
            <ProcessInstanceDetailsHeader processInstance={processInstance} />
            <ProcessInstanceDetailsTable processInstance={processInstance} />
        </Box>
    );
};

export default ProcessInstanceDetails;
