import React from 'react';

import { Box, Alert, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';


const ProcessQueueDetails = () => {
    const job = useSelector((state) => state.processInstance.active.job);
    const { translate } = useTranslations();

    if (job?.errorMessage) {
        return (
            <Box display="flex" flexDirection="column" padding="0.625rem" gap="1rem">
                <Alert variant='filled' severity='error'>
                    <Typography
                        variant="body1"
                        sx={{ textAlign: 'center' }}
                    >
                        {`${translate('Component.ProcessQueueDetails.Error')} ${job.errorMessage}`}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    if (!job || !job.jobId) return null;

    return (
        <Box display="flex" flexDirection="column" padding="0.625rem" gap="1rem">
            <Alert variant='filled' severity='warning'>
                <If condition={job.isProcessing || job.jobIndex === 0} else={(
                    <Typography
                        variant="body1"
                        sx={{ textAlign: 'center' }}
                    >
                        {`${translate('Component.ProcessQueueDetails.Queue')} ${job.jobIndex}`}
                    </Typography>
                )}>
                    <Typography
                        variant="body1"
                        sx={{ textAlign: 'center' }}
                    >
                        {translate('Component.ProcessQueueDetails.Processing')}
                    </Typography>
                </If>
            </Alert>
        </Box>
    );
};

export default ProcessQueueDetails;
