import { IProcessInstanceLoopEvent } from 'runbotics-common';

import { sortByFinished } from '#src-app/components/InfoPanel/ProcessInstanceEventsDetails/ProcessInstanceEventsDetails.utils';

import { EventMapTypes, ProcessInstanceEventState } from './ProcessInstanceEvent.state';

export const sortEventsByFinished = (events: IProcessInstanceLoopEvent[]) => events.slice().sort(sortByFinished);

export const addIterationStartEvents = (events: IProcessInstanceLoopEvent[]) => events.reduce((acc, item) => {
    const newIteration =
            acc.length === 0 ||
            acc[acc.length - 1].iterationNumber !==
                item.iterationNumber;
    if (newIteration) {
        const iterationStarted = new Date(item.created);
        iterationStarted
            .setMilliseconds(
                iterationStarted.getMilliseconds() - 1
            )
            .toString();
        acc.push({
            iterationNumber: item.iterationNumber,
            iteratorElement: item.iteratorElement,
            type: EventMapTypes.Iteration,
            created: iterationStarted.toISOString(),
        });
    }
    acc.push({
        ...item,
        type: EventMapTypes.ProcessInstanceLoopEvent,
    });

    return acc;
}, []);

export const shouldAddIterationBreadcrumb = (state: ProcessInstanceEventState, nestedIteration: boolean) => (
    state.all.eventsBreadcrumbTrail.at(-1)?.type !== EventMapTypes.Iteration &&
        nestedIteration
);
