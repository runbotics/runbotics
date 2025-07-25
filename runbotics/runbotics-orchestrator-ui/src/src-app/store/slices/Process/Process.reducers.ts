import { PayloadAction } from '@reduxjs/toolkit';
import { ACTION_GROUP, IProcess } from 'runbotics-common';

import { IBpmnAction } from '#src-app/Actions/types';
import { Options, Variable } from '#src-app/hooks/useOptions';
import { ProcessListDisplayMode } from '#src-app/views/process/ProcessBrowseView/ProcessList/ProcessList.utils';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { initialModelerState, initialState } from './Process.slice';
import { ModelerError, ProcessState } from './Process.state';

export const updateProcess = (
    state: ProcessState,
    action: PayloadAction<IProcess>
) => {
    state.all.byId[action.payload.id] = action.payload;
};

export const updateProcessPage = (
    state: ProcessState,
    action: PayloadAction<IProcess>
) => {
    state.all.page.content = state.all.page.content.map((process) =>
        process.id === action.payload.id
            ? { ...process, ...action.payload }
            : process
    );
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

export const setCurrentProcessOutputElement = (
    state: ProcessState,
    action: PayloadAction<BPMNElement | null>
) => {
    state.modeler.currentProcessOutputElement = action.payload;
};

export const resetSelection = (state: ProcessState) => {
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

const handleSetError = (stateKey: string, state: ProcessState, action: PayloadAction<ModelerError>) => {
    const errorIndex = state.modeler[stateKey].findIndex(
        (error) => error.elementId === action.payload.elementId
    );
    if (errorIndex === -1) {
        state.modeler[stateKey] = [...state.modeler[stateKey], action.payload];
    }
};

export const setError = (
    state: ProcessState,
    action: PayloadAction<ModelerError>
) => {
    handleSetError('errors', state, action);
};

export const setCustomValidationError = (
    state: ProcessState,
    action: PayloadAction<ModelerError>
) => {
    handleSetError('customValidationErrors', state, action);
};

export const resetDraft = (state: ProcessState) => {
    state.draft = initialState.draft;
};

export const removeDraftProcessSchedule = (state: ProcessState, action: PayloadAction<number>) => {
    if (state.draft.process?.schedules) {
        state.draft.process.schedules = state.draft.process.schedules
            .filter(schedule => schedule.id !== action.payload);
    }
};

export const setImported = (
    state: ProcessState,
    action: PayloadAction<boolean>
) => {
    state.modeler.imported = action.payload;
};

const handleRemoveError = (stateKey: string, state: ProcessState, action: PayloadAction<string>) => {
    state.modeler[stateKey] = state.modeler[stateKey].filter(
        (error) => error.elementId !== action.payload
    );
};

export const removeError = (
    state: ProcessState,
    action: PayloadAction<string>
) => {
    handleRemoveError('errors', state, action);
};

export const removeCustomValidationError = (
    state: ProcessState,
    action: PayloadAction<string>
) => {
    handleRemoveError('customValidationErrors', state, action);
};

export const clearErrors = (state: ProcessState) => {
    state.modeler.errors = [];
    state.modeler.customValidationErrors = [];
};

export const clearModelerState = (state: ProcessState) => {
    state.modeler = { ...initialModelerState, imported: state.modeler.imported };
};

export const setOptions = (state: ProcessState, action: PayloadAction<Options>) => {
    state.modeler.options = action.payload;
};

export const setVariables = (state: ProcessState, action: PayloadAction<Variable[]>) => {
    state.modeler.variables = action.payload;
};

export const setActiveDrag = (state: ProcessState, action: PayloadAction<boolean>) => {
    state.modeler.activeDrag = action.payload;
};

export const setProcessListDisplayMode = (state: ProcessState, action: PayloadAction<ProcessListDisplayMode>) => {
    state.all.listDisplayMode = action.payload;
};

export const setProcessBlacklistActions = (state: ProcessState, action: PayloadAction<ACTION_GROUP[]>) => {
    state.modeler.blacklistedActions = action.payload;
};
