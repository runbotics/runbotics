import { ProcessInstanceState, InstanceExtendedWithSubProcesses } from './ProcessInstance.state';

export const updateProcessInstanceProps = (state: ProcessInstanceState, processInstance: InstanceExtendedWithSubProcesses) => {
    const { id, subProcesses, hasSubProcesses, isLoadingSubProcesses } = processInstance;
    const pageContent = state.all.page?.content;
    if (!pageContent) return;

    state.all.page.content = pageContent
        .map((instance: InstanceExtendedWithSubProcesses) => 
            instance.id !== id
                ? instance 
                : ({ 
                    ...instance,
                    subProcesses: subProcesses !== undefined ? subProcesses : instance.subProcesses, 
                    hasSubProcesses: hasSubProcesses !== undefined ? hasSubProcesses : instance.hasSubProcesses,
                    isLoadingSubProcesses: isLoadingSubProcesses !== undefined ? isLoadingSubProcesses : instance.isLoadingSubProcesses,
                })
        );
};
