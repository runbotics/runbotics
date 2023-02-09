import {
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
} from 'runbotics-common';

type EventId = `Activity_${string}`;
type EventName = string;
export enum EventMapTypes {
    IterationGutter = 'iterationGutter',
    ProcessInstanceLoopEvent = 'ProcessInstanceLoopEvent',
}

export interface IterationGutter {
    iterationNumber: number;
    type: EventMapTypes.IterationGutter;
    created: string;
}
export type ProcessInstanceLoopEvent =
    | (IProcessInstanceLoopEvent & {
          type: EventMapTypes.ProcessInstanceLoopEvent;
      })
    | IterationGutter;

export interface ProcessInstanceEventState {
    all: {
        events: IProcessInstanceEvent[];
        nestedEvents: {
            eventMap: Record<EventId, ProcessInstanceLoopEvent[]>;
            idNameMap: Record<EventId, EventName>;
        };
        eventsBreadcrumbTrail: string[];
        loading: boolean;
    };
}
