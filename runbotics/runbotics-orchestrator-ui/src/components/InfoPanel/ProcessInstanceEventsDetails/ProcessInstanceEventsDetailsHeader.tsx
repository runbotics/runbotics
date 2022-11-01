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
import { capitalizeFirstLetter, convertToPascalCase } from 'src/utils/text';
import i18n from 'i18next';
import actionKeys from 'src/translations/actionKeys';

interface Props {
    processInstanceEvent: IProcessInstanceEvent;
}

const ProcessInstanceEventsDetailsHeader: VFC<Props> = ({ processInstanceEvent }) => {
    const { translate } = useTranslations();
    const formattedStatus = convertToPascalCase(processInstanceEvent.status);
    const [translatedLabel, setTranslatedLabel] = useState(processInstanceEvent.step);
    const translateKey = `Process.Details.Modeler.Actions.${((processInstanceEvent.step).split('.')).reduce((prev, curr) => {
        if(curr){
            return prev.charAt(0).toUpperCase() + prev.slice(1) + '.' + curr.charAt(0).toUpperCase() + curr.slice(1);
        } else {
            return prev.charAt(0).toUpperCase() + prev.slice(1);
        }
    })}.Label`;

    useEffect(() => {
        if (checkIfKeyExists(translateKey)) {
            setTranslatedLabel(translate(translateKey));
        }
    }, [i18n.language])

    return (
        <GridContainer>
            <GridItem width="100%">
                <Typography variant="h5">{translatedLabel}</Typography>
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
