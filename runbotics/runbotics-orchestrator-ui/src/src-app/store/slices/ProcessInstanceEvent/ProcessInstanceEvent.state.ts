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
    iteratorElement: JSON;
}

export interface Breadcrumb {
    id: string;
    labelKey: string;
    type: EventMapTypes;
    iterationNumber?: number;
}

export type ProcessInstanceLoopEvent =
    | IProcessInstanceLoopEvent & {
          type: EventMapTypes.ProcessInstanceLoopEvent;
      };

export type LoopIterationEvents = {
    [iterationNumber: number]: ProcessInstanceLoopEvent[];
};

export interface ProcessInstanceEventState {
    all: {
        events: IProcessInstanceEvent[];
        nestedEvents: Record<EventId, LoopIterationEvents>;
        eventsBreadcrumbTrail: Breadcrumb[];
        loading: boolean;
    };
}
