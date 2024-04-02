import React, { useMemo } from 'react';

import { Box, Alert, Typography } from '@mui/material';

import { WsMessage } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';

const ProcessQueueDetails = () => {
    const { process } = useSelector((state) => state.process.draft);
    const { jobsMap } = useSelector((state) => state.processInstance.active);
    const { translate } = useTranslations();

    const queueDetailsAlert = useMemo(() => {
        const job = jobsMap[process?.id];
        switch (job?.eventType) {
            case WsMessage.PROCESS_START_FAILED:
            case WsMessage.JOB_REMOVE_FAILED:
            case WsMessage.JOB_FAILED:
                return (
                    <Alert variant='filled' severity='error'>
                        <Typography
                            variant="body1"
                            sx={{ textAlign: 'center' }}
                        >
                            {translate('Component.ProcessQueueDetails.Error', { errorMessage: job.errorMessage })}
                        </Typography>
                    </Alert>
                );
            case WsMessage.JOB_WAITING:
                return (
                    <Alert variant='filled' severity='warning'>
                        <Typography
                            variant="body1"
                            sx={{ textAlign: 'center' }}
                        >
                            {translate('Component.ProcessQueueDetails.Queue', { queuePosition: job.queuePosition })}
                        </Typography>
                    </Alert>
                );
            case WsMessage.JOB_ACTIVE:
                return (
                    <Alert variant='filled' severity='warning'>
                        <Typography
                            variant="body1"
                            sx={{ textAlign: 'center' }}
                        >
                            {translate('Component.ProcessQueueDetails.Processing')}
                        </Typography>
                    </Alert>
                );
            default:
                return null;
        }
    }, [jobsMap]);

    return (
        <Box display="flex" flexDirection="column" padding="0.625rem" gap="1rem">
            {queueDetailsAlert}
        </Box>
    );
};

export default ProcessQueueDetails;
