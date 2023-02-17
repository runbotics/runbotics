/* eslint-disable arrow-body-style */
import { VFC } from 'react';

import {
    EventMapTypes,
    LoopIterationEvents,
} from '#src-app/store/slices/ProcessInstanceEvent';

import { sortByIteration } from '#src-app/store/slices/ProcessInstanceEvent/ProcessInstanceEvent.utils';

import EventRenderer from './EventRenderer';

interface LoopEventsRendererProps {
    processInstanceLoopEvents: LoopIterationEvents;
    container: HTMLDivElement;
}

const LoopEventsRenderer: VFC<LoopEventsRendererProps> = ({
    processInstanceLoopEvents,
}) => {
    return (
        <>
            {Object.values(processInstanceLoopEvents)
                .sort(sortByIteration)
                .map((events) => (
                    <EventRenderer
                        processInstanceEvents={events}
                        key={events[0].id}
                        iterationGutter={{
                            iterationNumber: events[0].iterationNumber,
                            iteratorElement: events[0]?.iteratorElement ?? null,
                            type: EventMapTypes.Iteration,
                        }}
                    />
                ))}
        </>
    );
};

export default LoopEventsRenderer;
