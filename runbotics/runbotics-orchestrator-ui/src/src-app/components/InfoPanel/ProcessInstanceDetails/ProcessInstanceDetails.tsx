import React, { useEffect, VFC } from 'react';

import { Box, CircularProgress } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';

import { checkJobStatus } from '#src-app/components/utils/checkJobStatus';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { processSelector } from '#src-app/store/slices/Process/Process.slice';
import { processInstanceActions, processInstanceSelector } from '#src-app/store/slices/ProcessInstance';

import ProcessInstanceDetailsHeader from './ProcessInstanceDetailsHeader';

import ProcessInstanceDetailsTable from './ProcessInstanceDetailsTable';



interface ProcessInstanceDetailsProps {
    processInstanceId: string;
    onClose?: () => void;
}

const ProcessInstanceDetails: VFC<ProcessInstanceDetailsProps> = ({ processInstanceId, onClose }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const containerRef = React.useRef<HTMLDivElement>(null);

    const processInstanceState = useSelector(processInstanceSelector);
    const active = processInstanceState?.active;
    const { draft: { process } } = useSelector(processSelector);
    const processId = process?.id;
    const isProcessQueuedOrFailed = checkJobStatus(processId, active);

    const getActiveProcessInstanceIfMatch = () =>
        processInstanceId === processInstanceState.active.processInstance?.id
            ? processInstanceState.active.processInstance
            : processInstanceState.all.byId[processInstanceId];

    const processInstance = processInstanceId
        ? getActiveProcessInstanceIfMatch()
        : processInstanceState.active.processInstance;

    useEffect(() => {
        if (processInstanceId) {
            dispatch(processInstanceActions.getProcessInstance({ resourceId: processInstanceId }))
                .then(unwrapResult)
                .catch(() => {
                    onClose?.();
                    enqueueSnackbar(
                        translate('History.Table.Error.ProcessInstanceNotFound'),
                        { variant: 'error' },
                    );
                });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processInstanceId]);

    if (isProcessQueuedOrFailed) return null;

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
