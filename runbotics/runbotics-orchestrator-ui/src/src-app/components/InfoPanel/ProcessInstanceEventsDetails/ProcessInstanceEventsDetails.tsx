import React, { useCallback, useEffect, VFC } from 'react';

import { Box, Typography, Divider } from '@mui/material';

import { IProcessInstanceEvent } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
import {
    EventMapTypes,
    IterationGutter,
    processInstanceEventActions,
    processInstanceEventSelector,
    ProcessInstanceLoopEvent,
} from '#src-app/store/slices/ProcessInstanceEvent';

import EventSlide from '../EventSlide';
import IterationSlide from '../IterationSlide';
import {
    iterationEventGuard,
    sortByFinished,
} from './ProcessInstanceEventsDetails.utils';

interface ProcessInstanceEventsDetailsProps {
    processInstanceId: string;
}

const ProcessInstanceEventsDetails: VFC<ProcessInstanceEventsDetailsProps> = ({
    processInstanceId,
}) => {
    const dispatch = useDispatch();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { translate } = useTranslations();
    const [expandedEventId, setExpandedEventId] = React.useState<number>(null);
    
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

        const lastEvent = eventsBreadcrumbTrail.at(-1);
        const secondLastEvent = eventsBreadcrumbTrail.at(-2);

        if (eventsBreadcrumbTrail.length > 1 && lastEvent.type === EventMapTypes.Iteration) {
            return loopEvents[secondLastEvent.id].filter(
                (element) =>
                    element.iterationNumber === lastEvent.iterationNumber
            );
        }

        if (eventsBreadcrumbTrail.length > 1) {
            return loopEvents[lastEvent.id];
        }

        if (!processInstanceId) {
            return Object.values(active.eventsMap);
        }

        return events;
    };

    const processInstanceEvents = getProcessInstanceEvents();

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
            (_event: React.SyntheticEvent, isExpanded: boolean) => {
                setExpandedEventId(isExpanded ? panelId : null);
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
                    .map(
                        (event: IProcessInstanceEvent | IterationGutter, index: number) =>
                            iterationEventGuard(event) ? (
                                <IterationSlide
                                    iterationGutter={event}
                                    onChange={handleChange}
                                    expandedEventId={expandedEventId}
                                    key={event.iterationNumber}
                                    ref={containerRef}
                                    onRefChange={onRefChange}
                                    shouldReScroll={index === processInstanceEvents.length - 1}
                                />
                            ) : (
                                <EventSlide
                                    key={event.id}
                                    processInstanceEvent={event}
                                    expandedEventId={expandedEventId}
                                    onChange={handleChange}
                                    onRefChange={onRefChange}
                                    shouldReScroll={index === processInstanceEvents.length - 1}
                                />
                            )
                    )}
            </Box>
        </>
    );
};

export default ProcessInstanceEventsDetails;
