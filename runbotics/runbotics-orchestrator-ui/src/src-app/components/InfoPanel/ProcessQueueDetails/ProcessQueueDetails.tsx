import React, { useMemo } from 'react';

import { Box, Alert, Typography, AlertColor } from '@mui/material';

import { WsMessage } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';

interface AlertProps {
    message: string;
    severity: AlertColor;
}

const AlertComponent = ({ message, severity }: AlertProps) => (
    <Alert variant='filled' severity={severity}>
        <Typography
            variant="body1"
            sx={{ textAlign: 'center' }}
        >
            {message}
        </Typography>
    </Alert>
);

const ProcessQueueDetails = () => {
    const { process } = useSelector((state) => state.process.draft);
    const { jobsMap } = useSelector((state) => state.processInstance.active);
    const { translate } = useTranslations();

    const queueDetailsAlert = useMemo(() => {
        const job = jobsMap[process?.id];
        switch (job?.eventType) {
            case WsMessage.JOB_FAILED:
                const errorMessage = translate(
                    'Component.ProcessQueueDetails.Error',
                    { errorMessage: job.errorMessage }
                );
                return (
                    <AlertComponent
                        message={errorMessage}
                        severity='error'
                    />
                );
            case WsMessage.JOB_WAITING:
                const queuePositionMessage = translate(
                    'Component.ProcessQueueDetails.Queue',
                    { queuePosition: job.queuePosition }
                );
                return (
                    <AlertComponent
                        message={queuePositionMessage}
                        severity='warning'
                    />
                );
            case WsMessage.JOB_ACTIVE:
                const processingMessage = translate(
                    'Component.ProcessQueueDetails.Processing'
                );
                return (
                    <AlertComponent
                        message={processingMessage}
                        severity='warning'
                    />
                );
            default:
                return null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobsMap]);

    return (
        <Box display="flex" flexDirection="column" padding="0.625rem" gap="1rem">
            {queueDetailsAlert}
        </Box>
    );
};

export default ProcessQueueDetails;
