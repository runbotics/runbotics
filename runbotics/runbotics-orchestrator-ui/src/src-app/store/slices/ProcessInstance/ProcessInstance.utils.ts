import { ProcessInstanceState, InstanceExtendedWithSubprocesses } from './ProcessInstance.state';

const spreadIfArray = (array: unknown) => Array.isArray(array) ? array : [];

const recursivelyInsertSubprocess = (
    parentInstanceId: string,
    currentNode: InstanceExtendedWithSubprocesses,
    targetSubprocesses: InstanceExtendedWithSubprocesses[],
) => {
    if (currentNode.id === parentInstanceId) {
        currentNode.subprocesses = [...spreadIfArray(currentNode.subprocesses), ...spreadIfArray(targetSubprocesses)];
    }

    currentNode.subprocesses?.forEach(subprocess =>
        recursivelyInsertSubprocess(parentInstanceId, subprocess, targetSubprocesses)
    );
};

export const updateProcessInstanceProps = (state: ProcessInstanceState, processInstance: InstanceExtendedWithSubprocesses) => {
    const { id, subprocesses, hasSubprocesses, isLoadingSubprocesses } = processInstance;

    if (!state.all.page?.content) return;

    const pageContent =
        state.all.page?.content
            .map((instance: InstanceExtendedWithSubprocesses) => {
                recursivelyInsertSubprocess(id, instance, subprocesses);
                if (instance.id !== id) {
                    return instance;
                }

                const updatedInstance = {
                    ...instance,
                    hasSubprocesses: hasSubprocesses !== undefined ? hasSubprocesses : instance.hasSubprocesses,
                    isLoadingSubprocesses: isLoadingSubprocesses !== undefined ? isLoadingSubprocesses : instance.isLoadingSubprocesses,
                };

                return updatedInstance;
            });

    state.all.page.content = pageContent;
};
