import React, { useEffect, useRef, useState, VFC } from 'react';

import { Box, Typography, Divider } from '@mui/material';

import { IProcessInstanceEvent, OrderDirection, OrderPropertyName } from 'runbotics-common';

import { checkJobStatus } from '#src-app/components/utils/checkJobStatus';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processSelector } from '#src-app/store/slices/Process';
import { processInstanceSelector } from '#src-app/store/slices/ProcessInstance';
import {
    EventMapTypes,
    LoopIterationEvents,
    processInstanceEventActions,
    processInstanceEventSelector,
} from '#src-app/store/slices/ProcessInstanceEvent';

import EventRenderer from './EventRenderer';
import LoopEventsRenderer from './LoopEventsRenderer';
import { RendererType } from './ProcessInstanceEventsDetails.types';
import { initialState } from './ProcessInstanceEventsDetails.utils';

interface ProcessInstanceEventsDetailsProps {
    processInstanceId: string;
}

const ProcessInstanceEventsDetails: VFC<ProcessInstanceEventsDetailsProps> = ({
    processInstanceId,
}) => {
    const dispatch = useDispatch();
    const containerRef = useRef<HTMLDivElement>(null);
    const { translate } = useTranslations();
    const [processInstanceEvents, setProcessInstanceEvents] = useState<{
        events: LoopIterationEvents | IProcessInstanceEvent[];
        renderer: RendererType;
    }>(initialState);

    const {
        all: { events, eventsBreadcrumbTrail, nestedEvents: loopEvents },
    } = useSelector(processInstanceEventSelector);
    const { active } = useSelector(processInstanceSelector);
    const { draft: { process } } = useSelector(processSelector);
    const processId = process?.id;
    const isProcessQueuedOrFailed = checkJobStatus(processId, active);

    useEffect(() => {
        if (processInstanceId === active.processInstance?.id) {
            setProcessInstanceEvents({
                events: Object.values(active.eventsMap),
                renderer: RendererType.Events,
            });
            return;
        }

        const lastEvent = eventsBreadcrumbTrail.at(-1);
        const secondLastEvent = eventsBreadcrumbTrail.at(-2);

        if (
            eventsBreadcrumbTrail.length > 1 &&
            lastEvent.type === EventMapTypes.Iteration
        ) {
            setProcessInstanceEvents({
                events: loopEvents[secondLastEvent.id][
                    lastEvent.iterationNumber
                ],
                renderer: RendererType.Events,
            });
            return;
        }

        if (eventsBreadcrumbTrail.length > 1) {
            setProcessInstanceEvents({
                events: loopEvents[lastEvent.id],
                renderer: RendererType.Loop,
            });
            return;
        }

        if (!processInstanceId) {
            setProcessInstanceEvents({
                events: Object.values(active.eventsMap),
                renderer: RendererType.Events,
            });
            return;
        }

        setProcessInstanceEvents({
            events: events,
            renderer: RendererType.Events,
        });
    }, [
        processInstanceId,
        active.processInstance?.id,
        loopEvents,
        events,
        active.eventsMap,
        eventsBreadcrumbTrail,
    ]);

    useEffect(() => {
        if (processInstanceId) {
            dispatch(
                processInstanceEventActions.getProcessInstanceEvents({
                    pageParams: {
                        size: 2000,
                        sort: {
                            by: OrderPropertyName.FINISHED,
                            order: OrderDirection.DESC,
                        },
                        filter: {
                            equals: {
                                processInstanceId,
                            },
                        },
                    },
                })
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processInstanceId]);

    if (isProcessQueuedOrFailed) return null;

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

    return (
        <>
            <Divider variant="middle">
                <Typography variant="h6">
                    {translate('Component.InfoPanel.EventsDetails.Activities')}
                </Typography>
            </Divider>
            <Box
                sx={{ margin: (theme) => theme.spacing(1) }}
                display="flex"
                flexDirection="column"
                gap="0.625rem"
            >
                <If
                    condition={
                        processInstanceEvents.renderer === RendererType.Events
                    }
                    else={
                        <LoopEventsRenderer
                            processInstanceLoopEvents={
                                processInstanceEvents?.events as LoopIterationEvents
                            }
                            container={containerRef.current}
                        />
                    }
                >
                    <EventRenderer
                        processInstanceEvents={
                            processInstanceEvents?.events as IProcessInstanceEvent[]
                        }
                        container={containerRef.current}
                        processInstanceId={processInstanceId}
                    />
                </If>
            </Box>
        </>
    );
};

export default ProcessInstanceEventsDetails;
