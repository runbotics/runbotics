import React, { useEffect, VFC } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { ProcessInstanceStatus } from 'runbotics-common';

import { useDispatch, useSelector } from '#src-app/store';

import { processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';

import ProcessInstanceDetailsHeader from './ProcessInstanceDetailsHeader';

import ProcessInstanceDetailsTable from './ProcessInstanceDetailsTable';



interface ProcessInstanceDetailsProps {
    processInstanceId: string;
}

// eslint-disable-next-line complexity
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
        if (processInstanceId) dispatch(processInstanceActions.getProcessInstance({ processInstanceId }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processInstanceId]);

    useEffect(
        () => () => {
            if (isProcessFinished) dispatch(processInstanceActions.resetActive());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const loading =
        processInstanceState.all.loading ||
        (processInstanceState.active.orchestratorProcessInstanceId &&
            !processInstanceState.active.processInstance &&
            !processInstanceId);

    if (loading)
    { return (
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: (theme) => theme.spacing(4) }}>
            <CircularProgress color="secondary" />
        </Box>
    ); }

    if (!processInstance) return null;

    return (
        <Box ref={containerRef} display="flex" flexDirection="column" padding="0.625rem" gap="1rem">
            <ProcessInstanceDetailsHeader processInstance={processInstance} />
            <ProcessInstanceDetailsTable processInstance={processInstance} />
        </Box>
    );
};

export default ProcessInstanceDetails;
