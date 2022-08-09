import React, { VFC } from 'react';
import { Typography } from '@mui/material';
import { IProcessInstanceEvent } from 'runbotics-common';
import Label from 'src/components/Label';
import { getProcessInstanceStatusColor } from 'src/utils/getProcessInstanceStatusColor';
import { formatTimeDiff } from 'src/utils/utils';
import If from 'src/components/utils/If';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
    GridContainer, GridItem,
} from './ProcessInstanceEventsDetails.styles';

interface Props {
    processInstanceEvent: IProcessInstanceEvent;
}

const ProcessInstanceEventsDetailsHeader: VFC<Props> = ({ processInstanceEvent }) => (
    <GridContainer>
        <GridItem width="100%">
            <Typography variant="h5">
                {processInstanceEvent.step}
            </Typography>
        </GridItem>
        <GridItem>
            <Typography>
                <Label color={getProcessInstanceStatusColor(processInstanceEvent.status)}>
                    {processInstanceEvent.status.replace('_', ' ')}
                </Label>
            </Typography>
        </GridItem>
        <If condition={!!processInstanceEvent.created && !!processInstanceEvent.finished}>
            <GridItem>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.3125rem' }}>
                    <AccessTimeIcon />
                    {formatTimeDiff(processInstanceEvent.created, processInstanceEvent.finished)}
                </Typography>
            </GridItem>
        </If>
    </GridContainer>
);

export default ProcessInstanceEventsDetailsHeader;
