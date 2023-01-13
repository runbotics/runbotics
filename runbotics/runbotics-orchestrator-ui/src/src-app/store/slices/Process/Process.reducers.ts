import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/BPMN';
import { PayloadAction } from '@reduxjs/toolkit';
import { IProcess } from 'runbotics-common';
import BpmnModelerType from 'bpmn-js/lib/Modeler';

import { ProcessState } from './Process.state';
import { IBpmnAction } from '#src-app/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Actions/types';

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
        state.modeler.appliedActivities = state.modeler.appliedActivities
            .filter((activity) => activity !== action.payload);
    }

};

export const setSaveDisabled = (state: ProcessState, action: PayloadAction<boolean>) => {
    state.modeler.isSaveDisabled = action.payload;
};

export const setSelectedElement = (state: ProcessState, action: PayloadAction<BPMNElement>) => {
    state.modeler.selectedElement = action.payload;
}

export const setSelectedAction = (state: ProcessState, action: PayloadAction<IBpmnAction>) => {
    state.modeler.selectedAction = action.payload;
}

export const setPassedInVariables = (state: ProcessState, action: PayloadAction<string[]>) => {
    state.modeler.passedInVariables = action.payload;
}

export const setCommandStack = (state: ProcessState, action: PayloadAction<ProcessState['modeler']['commandStack']>) => {
    state.modeler.commandStack = action.payload;
}
