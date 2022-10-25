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
import {checkIfKeyExists, translate} from '../../../hooks/useTranslations'
import { convertToPascalCase } from 'src/utils/text';
import i18n from 'i18next';
import { TranslationsDescriptors } from 'src/translations/translations';

interface Props {
    processInstanceEvent: IProcessInstanceEvent;
}

const ProcessInstanceEventsDetailsHeader: VFC<Props> = ({ processInstanceEvent }) => {
    const formattedStatus = convertToPascalCase(processInstanceEvent.status);
    const [step, setStep] = useState<string>(processInstanceEvent.step)

    useEffect(() => {
        if (checkIfKeyExists(processInstanceEvent.step)) {
            setStep(translate(processInstanceEvent.step));
        } else {
            setStep(processInstanceEvent.step);
        }
    }, [i18n.language])

    return (
        <GridContainer>
            <GridItem width="100%">
                <Typography variant="h5">{step}</Typography>
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
