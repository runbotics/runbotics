import { IProcessInstanceLoopEvent } from 'runbotics-common';

import { sortByFinished } from '#src-app/components/InfoPanel/ProcessInstanceEventsDetails/ProcessInstanceEventsDetails.utils';

import { EventMapTypes, ProcessInstanceEventState, ProcessInstanceLoopEvent } from './ProcessInstanceEvent.state';

export const sortEventsByFinished = (events: IProcessInstanceLoopEvent[]) => events.slice().sort(sortByFinished);


export const shouldAddIterationBreadcrumb = (state: ProcessInstanceEventState, nestedIteration: boolean) => (
    state.all.eventsBreadcrumbTrail.at(-1)?.type !== EventMapTypes.Iteration &&
        nestedIteration
);

export const divideEventsByIteration = ((acc: {}, obj: ProcessInstanceLoopEvent) => {
    const iterationNumber = obj.iterationNumber;
    if (!acc[iterationNumber]) {
        acc[iterationNumber] = [obj];
    } else {
        acc[iterationNumber].push(obj);
    }
    return acc;
});
