import React, { useEffect, useState, VFC } from 'react';
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
import useTranslations, { checkIfKeyExists } from '../../../hooks/useTranslations'
import { capitalizeFirstLetter} from 'src/utils/text';

interface Props {
    processInstanceEvent: IProcessInstanceEvent;
}

const ProcessInstanceEventsDetailsHeader: VFC<Props> = ({ processInstanceEvent }) => {
    const { translate } = useTranslations();
    const formattedStatus = capitalizeFirstLetter({ text: processInstanceEvent.status, lowerCaseRest: true, delimiter: /_| / });
    const translateKey = `Process.Details.Modeler.Actions.${capitalizeFirstLetter({ text: processInstanceEvent.step, delimiter: '.', join: '.'})}.Label`;
    
    return (
        <GridContainer>
            <GridItem width="100%">
                <Typography variant="h5">{checkIfKeyExists(translateKey) ? translate(translateKey) : processInstanceEvent.step}</Typography>
            </GridItem>
            <GridItem>
                <Typography>
                    <Label color={getProcessInstanceStatusColor(processInstanceEvent.status)}>
                        {/* @ts-ignore */}
                        {translate(`Component.HistoryTable.Status.${formattedStatus}`)}
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
};

export default ProcessInstanceEventsDetailsHeader;
