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

    const iteration = state.all.nestedEvents[action.payload.loopId][action.payload.iterationNumber];
    if (!iteration) {
        state.all.nestedEvents[action.payload.loopId][action.payload.iterationNumber] = [action.payload];
        return;
    }

    if (iteration.some((loopEvent) => loopEvent.id === action.payload.id)) {
        state.all.nestedEvents[action.payload.loopId][action.payload.iterationNumber] = iteration
            .map((loopEvent) => {
                if (loopEvent.id === action.payload.id) return action.payload;
                return loopEvent;
            });
        return;
    }

    state.all.nestedEvents[action.payload.loopId][action.payload.iterationNumber].push(action.payload);
};
