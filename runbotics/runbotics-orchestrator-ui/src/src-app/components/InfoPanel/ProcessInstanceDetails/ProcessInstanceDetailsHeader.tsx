import React, { VFC } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { IProcessInstance, ProcessInstanceStatus } from 'runbotics-common';


import Label from '#src-app/components/Label';
import If from '#src-app/components/utils/If';
import { getProcessInstanceStatusColor } from '#src-app/utils/getProcessInstanceStatusColor';
import { capitalizeFirstLetter } from '#src-app/utils/text';
import { formatTimeDiff } from '#src-app/utils/utils';

import { translate } from '../../../hooks/useTranslations';



interface Props {
    processInstance: IProcessInstance;
}

const isProcessInstanceActive = (
    status: ProcessInstanceStatus,
) => status === ProcessInstanceStatus.INITIALIZING
    || status === ProcessInstanceStatus.IN_PROGRESS;

const ProcessInstanceDetailsHeader: VFC<Props> = ({ processInstance }) => {

    const formattedStatus = capitalizeFirstLetter({ text: processInstance.status, lowerCaseRest: true, delimiter: /_| / });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">{processInstance.process.name}</Typography>
            </Grid>
            <Grid item>
                <Typography>
                    <Label warning={processInstance.warning} color={getProcessInstanceStatusColor(processInstance.status)}>
                        {/* @ts-ignore */}
                        {translate(`Component.HistoryTable.Status.${formattedStatus}`)}
                    </Label>
                </Typography>
            </Grid>
            <If condition={!!processInstance.updated}>
                <Grid item>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.3125rem' }}>
                        <AccessTimeIcon />
                        {formatTimeDiff(processInstance.created, processInstance.updated)}
                    </Typography>
                </Grid>
            </If>
            <If condition={isProcessInstanceActive(processInstance.status)} else={<Box height="20px" width="100%" />}>
                <Grid item xs={12}>
                    <LinearProgress />
                </Grid>
            </If>
        </Grid>
    );
};

export default ProcessInstanceDetailsHeader;
