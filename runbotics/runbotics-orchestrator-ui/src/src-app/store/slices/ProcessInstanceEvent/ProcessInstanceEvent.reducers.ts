import { PayloadAction } from '@reduxjs/toolkit';

import { initialState } from './ProcessInstanceEvent.slice';
import { ProcessInstanceEventState } from './ProcessInstanceEvent.state';

export const resetAll = (state: ProcessInstanceEventState) => {
    state.all = initialState.all;
};
export const reduceCrumbs = (state: ProcessInstanceEventState, action: PayloadAction<string>) => {
    const index = state.all.eventsBreadcrumbTrail.findIndex((item) => item.id === action.payload);
    state.all.eventsBreadcrumbTrail = state.all.eventsBreadcrumbTrail.slice(0, index + 1);
};
