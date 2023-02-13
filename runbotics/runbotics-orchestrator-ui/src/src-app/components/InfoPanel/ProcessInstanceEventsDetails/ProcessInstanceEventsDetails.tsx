import React, { useCallback, useEffect, VFC } from 'react';

import { Box, Typography, Divider } from '@mui/material';

import { IProcessInstanceEvent } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
import {
    EventMapTypes,
    processInstanceEventActions,
    processInstanceEventSelector,
    ProcessInstanceLoopEvent,
} from '#src-app/store/slices/ProcessInstanceEvent';

import InfoSlide from '../InfoSlide';
import IterationSlide from '../IterationSlide';
import { sortByFinished } from './ProcessInstanceEventsDetails.utils';

interface ProcessInstanceEventsDetailsProps {
    processInstanceId: string;
}

// eslint-disable-next-line complexity
const ProcessInstanceEventsDetails: VFC<ProcessInstanceEventsDetailsProps> = ({
    processInstanceId,
}) => {
    const dispatch = useDispatch();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { translate } = useTranslations();

    const {
        all: { events, eventsBreadcrumbTrail, nestedEvents: loopEvents },
    } = useSelector(processInstanceEventSelector);
    const { active } = useSelector(processInstanceSelector);

    // eslint-disable-next-line complexity
    const getProcessInstanceEvents = ():
        | ProcessInstanceLoopEvent[]
        | IProcessInstanceEvent[] => {
        if (processInstanceId === active.processInstance?.id) {
            return Object.values(active.eventsMap);
        }
        if (
            eventsBreadcrumbTrail.length > 1 &&
            eventsBreadcrumbTrail.at(-1).type === EventMapTypes.Iteration
        ) {
            return loopEvents[eventsBreadcrumbTrail.at(-2).id].filter(
                (element) =>
                    element.iterationNumber ===
                    eventsBreadcrumbTrail.at(-1).iterationNumber
            );
        }
        if (eventsBreadcrumbTrail.length > 1) {
            return loopEvents[eventsBreadcrumbTrail.at(-1).id];
        }
        if (!processInstanceId) {
            return Object.values(active.eventsMap);
        }
        return events;
    };

    const processInstanceEvents = getProcessInstanceEvents();

    const [expanded, setExpanded] = React.useState<number>(null);

    useEffect(() => {
        if (processInstanceId) {
            dispatch(
                processInstanceEventActions.getProcessInstanceEvents({
                    processInstanceId,
                })
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processInstanceId]);

    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node && !processInstanceId) {
            node.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleChange =
        (panelId: number) =>
            (event: React.SyntheticEvent, isExpanded: boolean) => {
                setExpanded(isExpanded ? panelId : null);
            };

    if (!processInstanceId && !active.orchestratorProcessInstanceId) {
        return (
            <Typography
                variant="body1"
                sx={{ pt: (theme) => theme.spacing(4), textAlign: 'center' }}
            >
                {translate('Component.InfoPanel.EventsDetails.NoData')}
            </Typography>
        );
    }

    if (processInstanceEvents?.length === 0) return null;

    return (
        <>
            <Divider variant="middle">
                <Typography variant="h6">
                    {translate('Component.InfoPanel.EventsDetails.Activities')}
                </Typography>
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
                    .map((processInstanceEvent, index) =>
                        processInstanceEvent.type ===
                        EventMapTypes.Iteration ? (
                                <IterationSlide
                                    iterationGutter={processInstanceEvent}
                                    handleChange={handleChange}
                                    containerRef={containerRef}
                                    expanded={expanded}
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index + 1}
                                />
                            ) : (
                                <InfoSlide
                                    containerRef={containerRef}
                                    key={processInstanceEvent.id}
                                    processInstanceEvent={processInstanceEvent}
                                    expanded={expanded}
                                    handleChange={handleChange}
                                    index={index}
                                    onRefChange={onRefChange}
                                    processInstanceEventsLength={
                                        processInstanceEvents.length
                                    }
                                />
                            )
                    )}
            </Box>
        </>
    );
};

export default ProcessInstanceEventsDetails;
