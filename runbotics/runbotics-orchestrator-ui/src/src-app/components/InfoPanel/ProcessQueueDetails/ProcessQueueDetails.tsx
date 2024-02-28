import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { Box, Typography } from '@mui/material';
import React from 'react'

const ProcessQueueDetails = () => {
    const job = useSelector((state) => state.processInstance.active.job);
    const { translate } = useTranslations();

    if (job?.errorMessage) return (
        <Box display="flex" flexDirection="column" padding="0.625rem" gap="1rem">
            <Typography
                variant="body1"
                sx={{ pt: (theme) => theme.spacing(4), textAlign: 'center' }}
            >
                {`${translate('Component.ProcessQueueDetails.Error')} ${job.errorMessage}`}
            </Typography>
        </Box>
    );

    if (!job || !job.jobId) return null;

    return (
        <Box display="flex" flexDirection="column" padding="0.625rem" gap="1rem">
            <If condition={!job.isProcessing} else={(
                <Typography
                    variant="body1"
                    sx={{ pt: (theme) => theme.spacing(4), textAlign: 'center' }}
                >
                    {translate('Component.ProcessQueueDetails.Processing')}
                </Typography>
            )}>
                <Typography
                    variant="body1"
                    sx={{ pt: (theme) => theme.spacing(4), textAlign: 'center' }}
                >
                    {`${translate('Component.ProcessQueueDetails.Queue')} ${job.jobIndex}`}
                </Typography>
            </If>
        </Box>
    );
}

export default ProcessQueueDetails