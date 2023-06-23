import { ProcessInstanceState, InstanceExtendedWithSubprocesses } from './ProcessInstance.state';

export const updateProcessInstanceProps = (state: ProcessInstanceState, processInstance: InstanceExtendedWithSubprocesses) => {
    const { id, subprocesses, hasSubprocesses, isLoadingSubprocesses } = processInstance;
    const pageContent = state.all.page?.content;
    if (!pageContent) return;

    state.all.page.content = pageContent
        .map((instance: InstanceExtendedWithSubprocesses) => 
            instance.id !== id
                ? instance 
                : ({ 
                    ...instance,
                    subprocesses: subprocesses !== undefined ? subprocesses : instance.subprocesses, 
                    hasSubprocesses: hasSubprocesses !== undefined ? hasSubprocesses : instance.hasSubprocesses,
                    isLoadingSubprocesses: isLoadingSubprocesses !== undefined ? isLoadingSubprocesses : instance.isLoadingSubprocesses,
                })
        );
};
