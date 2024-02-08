import { PayloadAction } from '@reduxjs/toolkit';

import { IProcessInstanceLoopEvent } from 'runbotics-common';

import { initialState } from './ProcessInstanceEvent.slice';
import { ProcessInstanceEventState } from './ProcessInstanceEvent.state';

export const resetAll = (state: ProcessInstanceEventState) => {
    state.all = initialState.all;
};
export const reduceCrumbs = (
    state: ProcessInstanceEventState,
    action: PayloadAction<string>
) => {
    const index = state.all.eventsBreadcrumbTrail.findIndex(
        (item) => item.id === action.payload
    );
    state.all.eventsBreadcrumbTrail = state.all.eventsBreadcrumbTrail.slice(
        0,
        index + 1
    );
};

export const updateSingleActiveLoopEvent = (state: ProcessInstanceEventState, action: PayloadAction<IProcessInstanceLoopEvent>) => {
    if (!state.all.nestedEvents[action.payload.loopId]) return;

    const iterationEvents = state.all.nestedEvents[action.payload.loopId][action.payload.iterationNumber];
    if (!iterationEvents) {
        state.all.nestedEvents[action.payload.loopId][action.payload.iterationNumber] = [action.payload];
        return;
    }

    if (iterationEvents.some((loopEvent) => loopEvent.id === action.payload.id)) {
        state.all.nestedEvents[action.payload.loopId][action.payload.iterationNumber] = iterationEvents
            .map((loopEvent) => {
                if (loopEvent.id === action.payload.id) return action.payload;
                return loopEvent;
            });
        return;
    }

    iterationEvents.push(action.payload);
    iterationEvents.sort(
        (a: IProcessInstanceLoopEvent, b: IProcessInstanceLoopEvent) => new Date(a?.created).getTime() - new Date(b?.created).getTime(),
    );
};
