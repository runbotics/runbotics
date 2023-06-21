

import { IProcessInstance } from 'runbotics-common';

import { ProcessInstanceState } from './ProcessInstance.state';

interface subProcessesReducerAction { 
    payload?: unknown;
    meta: { 
        arg: { processInstanceId: string } 
    };
}

export const updateSubProcessRelatedProps = (
    state: ProcessInstanceState, 
    isLoading: boolean, 
    action: subProcessesReducerAction,
) => {
    const { processInstanceId } = action.meta.arg;
    const subProcesses = action?.payload ? action.payload : [];
    const pageContent = state.all.page?.content;
    if (!pageContent) return;

    state.all.page.content = pageContent
        .map((processInstance: IProcessInstance) => 
            processInstance.id !== processInstanceId 
                ? processInstance 
                : { ...processInstance, isLoadingSubProcesses: isLoading, subProcesses } as IProcessInstance
        );
};

export const sendErrorMessage = (message: string) => {
    throw new Error(message);
};
