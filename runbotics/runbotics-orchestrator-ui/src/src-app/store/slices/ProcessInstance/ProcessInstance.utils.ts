import { ProcessInstanceState, InstanceExtendedWithSubprocesses } from './ProcessInstance.state';

const recursivelyInsertSubprocess = (
    parentInstanceId: string, 
    currentNode: InstanceExtendedWithSubprocesses, 
    targetSubprocesses: InstanceExtendedWithSubprocesses[],
) => {
    if (currentNode.id === parentInstanceId) {
        currentNode.subprocesses = targetSubprocesses;
    }

    currentNode.subprocesses?.forEach(subprocess => 
        recursivelyInsertSubprocess(parentInstanceId, subprocess, targetSubprocesses)
    );
};

export const updateProcessInstanceProps = (state: ProcessInstanceState, processInstance: InstanceExtendedWithSubprocesses) => {
    const { id, subprocesses } = processInstance;
    const pageContent = state.all.page?.content;
    if (!pageContent) return;

    pageContent
        .forEach((instance: InstanceExtendedWithSubprocesses) => {
            recursivelyInsertSubprocess(id, instance, subprocesses);
        });

    state.all.page.content = pageContent;
};
