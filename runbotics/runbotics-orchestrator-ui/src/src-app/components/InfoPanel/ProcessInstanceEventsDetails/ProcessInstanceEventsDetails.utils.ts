import { IProcessInstanceEvent } from 'runbotics-common';

import {
    EventMapTypes,
    IterationGutter,
} from '#src-app/store/slices/ProcessInstanceEvent';

export const sortByFinished = (
    aEvent: IProcessInstanceEvent,
    bEvent: IProcessInstanceEvent
) => new Date(aEvent.created).getTime() - new Date(bEvent.created).getTime();

export const iterationEventGuard = (event: any): event is IterationGutter =>
    event.type === EventMapTypes.Iteration;
