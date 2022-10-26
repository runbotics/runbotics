import React, { useCallback, useEffect, VFC } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, AccordionDetails, Slide, Typography, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { processInstanceEventActions, processInstanceEventSelector } from 'src/store/slices/ProcessInstanceEvent';
import { processInstanceSelector } from 'src/store/slices/ProcessInstance';
import { IProcessInstanceEvent } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
import {
    ProcessInstanceEventsDetailsHeader,
    ProcessInstanceEventsDetailsTable,
    AccordionHeader,
    RoundedAccordion,
} from '.';

interface ProcessInstanceEventsDetailsProps {
    processInstanceId: string;
}

const sortByFinished = (aEvent: IProcessInstanceEvent, bEvent: IProcessInstanceEvent) =>
    new Date(aEvent.created).getTime() - new Date(bEvent.created).getTime();

const ProcessInstanceEventsDetails: VFC<ProcessInstanceEventsDetailsProps> = ({ processInstanceId }) => {
    const dispatch = useDispatch();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { translate } = useTranslations();

    const processInstanceEventState = useSelector(processInstanceEventSelector);
    const { active } = useSelector(processInstanceSelector);

    const getActiveProcessInstanceEventsIfMatch = () =>
        processInstanceId === active.processInstance?.id
            ? Object.values(active.eventsMap)
            : processInstanceEventState.all.events;

    const processInstanceEvents = processInstanceId
        ? getActiveProcessInstanceEventsIfMatch()
        : Object.values(active.eventsMap);

    const [expanded, setExpanded] = React.useState<number>(null);

    useEffect(() => {
        if (processInstanceId) dispatch(processInstanceEventActions.getProcessInstanceEvents({ processInstanceId }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processInstanceId]);

    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node && !processInstanceId) node.scrollIntoView({ behavior: 'smooth', block: 'end' });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (panelId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panelId : null);
    };

    if (!processInstanceId && !active.orchestratorProcessInstanceId)
        return (
            <Typography variant="body1" sx={{ pt: (theme) => theme.spacing(4), textAlign: 'center' }}>
                {translate('Component.InfoPanel.EventsDetails.NoData')}
            </Typography>
        );

    if (processInstanceEvents.length === 0) return null;

    return (
        <>
            <Divider variant="middle">
                <Typography variant="h6">{translate('Component.InfoPanel.EventsDetails.Activities')}</Typography>
            </Divider>
            <Box
                ref={containerRef}
                sx={{ margin: (theme) => theme.spacing(1) }}
                display="flex"
                flexDirection="column"
                gap="0.625rem"
            >
                {processInstanceEvents
                    .slice()
                    .sort(sortByFinished)
                    .map((processInstanceEvent, index) => (
                        <Slide
                            direction="left"
                            in={!!processInstanceEvent}
                            container={containerRef.current}
                            key={processInstanceEvent.id}
                            {...(index === processInstanceEvents.length - 1 ? { ref: onRefChange } : {})}
                        >
                            <RoundedAccordion
                                expanded={expanded === processInstanceEvent.id}
                                onChange={handleChange(processInstanceEvent.id)}
                                disableGutters
                            >
                                <AccordionHeader expandIcon={<ExpandMoreIcon />}>
                                    <ProcessInstanceEventsDetailsHeader processInstanceEvent={processInstanceEvent} />
                                </AccordionHeader>
                                <AccordionDetails>
                                    <ProcessInstanceEventsDetailsTable processInstanceEvent={processInstanceEvent} />
                                </AccordionDetails>
                            </RoundedAccordion>
                        </Slide>
                    ))}
            </Box>
        </>
    );
};

export default ProcessInstanceEventsDetails;
