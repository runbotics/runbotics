import { PayloadAction } from '@reduxjs/toolkit';
import { IProcess } from 'runbotics-common';
import { ProcessState } from './Process.state';

export const updateProcess = (state: ProcessState, action: PayloadAction<IProcess>) => {
    state.all.byId[action.payload.id] = action.payload;
};

export const setAppliedActions = (state: ProcessState, action: PayloadAction<string[]>) => {
    state.modeler.appliedActivites = action.payload;
};

export const addAppliedAction = (state: ProcessState, action: PayloadAction<string>) => {
    if (!state.modeler.appliedActivites.includes(action.payload)) {
        state.modeler.appliedActivites.push(action.payload);
    }
};
