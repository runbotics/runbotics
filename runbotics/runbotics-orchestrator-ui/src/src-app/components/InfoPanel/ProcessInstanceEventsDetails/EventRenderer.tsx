import { FC, useCallback, useState } from 'react';

import { IProcessInstanceEvent } from 'runbotics-common';

import If from '#src-app/components/utils/If';

import { IterationGutter } from '#src-app/store/slices/ProcessInstanceEvent';

import { sortByFinished } from './ProcessInstanceEventsDetails.utils';
import EventSlide from '../EventSlide';

import IterationSlide from '../IterationSlide';

export interface EventRendererProps {
    processInstanceEvents: IProcessInstanceEvent[];
    processInstanceId?: string;
    container?: HTMLDivElement;
    iterationGutter?: IterationGutter;
}

const EventRenderer: FC<EventRendererProps> = ({
    processInstanceEvents,
    processInstanceId,
    container,
    iterationGutter,
}) => {
    const [expandedEventId, setExpandedEventId] = useState<number>(null);
    const onRefChange = useCallback((node: HTMLDivElement) => {
        if (node && !processInstanceId) {
            node.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (panelId: number, isExpanded: boolean) => {
        setExpandedEventId(isExpanded ? panelId : null);
    };

    if (processInstanceEvents?.length === 0) {
        return null;
    }

    return (
        <>
            <If condition={Boolean(iterationGutter)}>
                <IterationSlide
                    container={container}
                    expandedEventId={expandedEventId}
                    iterationGutter={iterationGutter}
                    onChange={handleChange}
                />
            </If>
            {processInstanceEvents
                .slice()
                .sort(sortByFinished)
                .map((event: IProcessInstanceEvent, index: number) => (
                    <EventSlide
                        key={event.id}
                        processInstanceEvent={event}
                        expandedEventId={expandedEventId}
                        onChange={handleChange}
                        onRefChange={onRefChange}
                        shouldReScroll={
                            index === processInstanceEvents.length - 1
                        }
                        container={container}
                    />
                ))}
        </>
    );
};

export default EventRenderer;
