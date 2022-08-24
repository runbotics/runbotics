import { PayloadAction } from '@reduxjs/toolkit';
import { IProcess } from 'runbotics-common';
import { initialModelerState } from './Process.slice';
import { CommandStackInfo, ProcessState } from './Process.state';

export const updateProcess = (state: ProcessState, action: PayloadAction<IProcess>) => {
    state.all.byId[action.payload.id] = action.payload;
};

export const setAppliedActions = (state: ProcessState, action: PayloadAction<string[]>) => {
    state.modeler.appliedActivities = action.payload;
};

export const addAppliedAction = (state: ProcessState, action: PayloadAction<string>) => {
    if (!state.modeler.appliedActivities.includes(action.payload)) {
        state.modeler.appliedActivities = [...state.modeler.appliedActivities, action.payload];
    }
};

export const removeAppliedAction = (state: ProcessState, action: PayloadAction<string>) => {
    if (state.modeler.appliedActivities.includes(action.payload)) {
        state.modeler.appliedActivities = state.modeler.appliedActivities.filter(
            (activity) => activity !== action.payload,
        );
    }
};

export const setModelerDirty = (state: ProcessState, action: PayloadAction<boolean>) => {
    state.modeler.isDirty = action.payload;
};

export const setModelerCommandStack = (
    state: ProcessState,
    action: PayloadAction<CommandStackInfo>,
) => {
    const { commandStackSize, commandStackIdx } = action.payload;
    state.modeler.commandStackSize = commandStackSize;
    state.modeler.commandStackIdx = commandStackIdx;
};

export const clearModelerState = (state: ProcessState) => {
    state.modeler = initialModelerState;
}