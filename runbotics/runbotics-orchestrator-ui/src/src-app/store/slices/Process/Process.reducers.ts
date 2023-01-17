import { PayloadAction } from '@reduxjs/toolkit';
import { IProcess } from 'runbotics-common';

import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/BPMN';

import { IBpmnAction } from '#src-app/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Actions/types';

import { ModelerError, ProcessState } from './Process.state';

export const updateProcess = (
    state: ProcessState,
    action: PayloadAction<IProcess>
) => {
    state.all.byId[action.payload.id] = action.payload;
};

export const setAppliedActions = (
    state: ProcessState,
    action: PayloadAction<string[]>
) => {
    state.modeler.appliedActivities = action.payload;
};

export const addAppliedAction = (
    state: ProcessState,
    action: PayloadAction<string>
) => {
    if (!state.modeler.appliedActivities.includes(action.payload)) {
        state.modeler.appliedActivities = [
            ...state.modeler.appliedActivities,
            action.payload,
        ];
    }
};

export const removeAppliedAction = (
    state: ProcessState,
    action: PayloadAction<string>
) => {
    if (state.modeler.appliedActivities.includes(action.payload)) {
        state.modeler.appliedActivities =
            state.modeler.appliedActivities.filter(
                (activity) => activity !== action.payload
            );
    }
};

export const setSaveDisabled = (
    state: ProcessState,
    action: PayloadAction<boolean>
) => {
    state.modeler.isSaveDisabled = action.payload;
};

export const setSelectedElement = (
    state: ProcessState,
    action: PayloadAction<BPMNElement>
) => {
    state.modeler.selectedElement = action.payload;
};

export const resetSelectedElement = (state: ProcessState) => {
    state.modeler.selectedElement = null;
    state.modeler.selectedAction = null;
};

export const setSelectedAction = (
    state: ProcessState,
    action: PayloadAction<IBpmnAction>
) => {
    state.modeler.selectedAction = action.payload;
};

export const setPassedInVariables = (
    state: ProcessState,
    action: PayloadAction<string[]>
) => {
    state.modeler.passedInVariables = action.payload;
};

export const setCommandStack = (
    state: ProcessState,
    action: PayloadAction<ProcessState['modeler']['commandStack']>
) => {
    state.modeler.commandStack = action.payload;
};

export const setError = (
    state: ProcessState,
    action: PayloadAction<Omit<ModelerError, 'appearedIdx'>>
) => {
    const errorIndex = state.modeler.errors.findIndex(
        (error) => error.elementId === action.payload.elementId
    );
    if (errorIndex === -1) {
        state.modeler.errors = [
            ...state.modeler.errors,
            {
                ...action.payload,
                appearedIdx: state.modeler.commandStack.commandStackIdx,
            },
        ];
    }
};

export const removeError = (
    state: ProcessState,
    action: PayloadAction<string>
) => {
    state.modeler.errors = state.modeler.errors.filter(
        (error) => error.elementId !== action.payload
    );
};

export const clearErrors = (state: ProcessState) => {
    state.modeler.errors = [];
};
