import { PayloadAction } from '@reduxjs/toolkit';
import union from 'lodash/union';
import { IProcessInstance, IProcessInstanceEvent } from 'runbotics-common';

import { initialState } from './ProcessInstance.slice';
import { ProcessInstanceState } from './ProcessInstance.state';
import { updateProcessInstanceProps } from './ProcessInstance.utils';

export const updateOrchestratorProcessInstanceId = (state: ProcessInstanceState, action: PayloadAction<string>) => {
    state.active.orchestratorProcessInstanceId = action.payload;
};

export const updateActiveProcessInstance = (state: ProcessInstanceState, action: PayloadAction<IProcessInstance>) => {
    state.active.processInstance = action.payload;
};

export const updateProcessInstance = (state: ProcessInstanceState, action: PayloadAction<IProcessInstance>) => {
    updateProcessInstanceProps(state, action.payload);
};

const updateEvent = (state: ProcessInstanceState, event: IProcessInstanceEvent) => {
    state.active.eventsMap[event.executionId] = event;
};

export const updateSingleActiveEvent = (state: ProcessInstanceState, action: PayloadAction<IProcessInstanceEvent>) => {
    updateEvent(state, action.payload);
};

export const updateActiveEvents = (state: ProcessInstanceState, action: PayloadAction<IProcessInstanceEvent[]>) => {
    action.payload.forEach((event) => updateEvent(state, event));
};

export const resetActiveProcessInstanceAndEvents = (state: ProcessInstanceState) => {
    state.active.eventsMap = initialState.active.eventsMap;
    state.active.processInstance = initialState.active.processInstance;
};

export const resetActive = (state: ProcessInstanceState) => {
    state.active = initialState.active;
};

const updateProcessInstancePageList = (processInstanceList: IProcessInstance[], newProcessInst: IProcessInstance) => {
    const exist = processInstanceList.some((item) => item.id === newProcessInst.id);

    if (!exist) 
    { return { exist }; }
    

    const newProcessInstancesList = processInstanceList.reduce<IProcessInstance[]>(
        (acc, processInstance) => (processInstance.id === newProcessInst.id
            ? [...acc, newProcessInst]
            : [...acc, processInstance]),
        [],
    );

    return { exist, newProcessInstancesList };
};

export const insert = (state: ProcessInstanceState, action: PayloadAction<IProcessInstance>) => {
    state.all.byId[action.payload.id] = action.payload;
    state.all.ids = union(state.all.ids, [String(action.payload.id)]);
    const { exist, newProcessInstancesList } = updateProcessInstancePageList(
        state.all.page?.content ?? [],
        action.payload,
    );

    if (exist) 
    { state.all.page.content = newProcessInstancesList; }
    else 
    { state.all.page?.content.unshift(action.payload); }
    
};
