import React, { VFC } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Typography } from '@mui/material';
import { IProcessInstanceEvent } from 'runbotics-common';



import Label from '#src-app/components/Label';
import If from '#src-app/components/utils/If';
import { getProcessInstanceStatusColor } from '#src-app/utils/getProcessInstanceStatusColor';
import { capitalizeFirstLetter} from '#src-app/utils/text';

import { formatTimeDiff } from '#src-app/utils/utils';

import {
    GridContainer, GridItem
} from './ProcessInstanceEventsDetails.styles';
import useTranslations, { checkIfKeyExists } from '../../../hooks/useTranslations';


interface Props {
    processInstanceEvent: IProcessInstanceEvent;
}

const ProcessInstanceEventsDetailsHeader: VFC<Props> = ({ processInstanceEvent }) => {
    const { translate } = useTranslations();
    const formattedStatus = capitalizeFirstLetter({ text: processInstanceEvent.status, lowerCaseRest: true, delimiter: /_| / });
    const translateKey = `Process.Details.Modeler.Actions.${capitalizeFirstLetter({ text: processInstanceEvent.step, delimiter: '.', join: '.'})}.Label`;
    const timeDiff = formatTimeDiff(processInstanceEvent.created, processInstanceEvent.finished);
    const formattedTimeDiff = timeDiff ? timeDiff : `< 500${translate('Common.Time.Miliseconds.Short')}`;


    return (
        <GridContainer>
            <GridItem width="100%">
                <Typography variant="h5">{checkIfKeyExists(translateKey) ? translate(translateKey) : processInstanceEvent.step}</Typography>
            </GridItem>
            <GridItem>
                <Typography>
                    <Label  color={getProcessInstanceStatusColor(processInstanceEvent.status)}>
                        {/* @ts-ignore */}
                        {translate(`Process.Instance.Status.${formattedStatus}`)}
                    </Label>
                </Typography>

            </GridItem>
            <If condition={!!processInstanceEvent.created && !!processInstanceEvent.finished}>
                <GridItem>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: '0.3125rem' }}>
                        <AccessTimeIcon />
                        {formattedTimeDiff}
                    </Typography>
                </GridItem>
            </If>
        </GridContainer>
    );
};

export default ProcessInstanceEventsDetailsHeader;
