import {
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
} from 'runbotics-common';

type EventId = `Activity_${string}`;

export enum EventMapTypes {
    Iteration = 'iteration',
    ProcessInstanceLoopEvent = 'ProcessInstanceLoopEvent',
    ProcessInstanceEvent = 'ProcessInstanceEvent',
}

export interface IterationGutter {
    iterationNumber: number;
    type: EventMapTypes.Iteration;
    created: string;
    iteratorElement: string;
}

export interface BreadCrumb {
    id: string;
    labelKey: string;
    type: EventMapTypes;
    iterationNumber?: number;
}

export type ProcessInstanceLoopEvent =
    | (IProcessInstanceLoopEvent & {
          type: EventMapTypes.ProcessInstanceLoopEvent;
      })
    | IterationGutter;

export interface ProcessInstanceEventState {
    all: {
        events: IProcessInstanceEvent[];
        nestedEvents: Record<EventId, ProcessInstanceLoopEvent[]>;
        eventsBreadcrumbTrail: BreadCrumb[];
        loading: boolean;
    };
}
