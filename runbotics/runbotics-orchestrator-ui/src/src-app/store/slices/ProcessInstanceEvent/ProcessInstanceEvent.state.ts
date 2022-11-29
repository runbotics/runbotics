import { IProcessInstanceEvent } from 'runbotics-common';

export interface ProcessInstanceEventState {
    all: {
        events: IProcessInstanceEvent[];
        loading: boolean;
    }
}
