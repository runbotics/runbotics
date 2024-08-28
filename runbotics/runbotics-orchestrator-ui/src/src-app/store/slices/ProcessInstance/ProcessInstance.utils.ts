import { ProcessInstanceState, InstanceExtendedWithSubprocesses } from './ProcessInstance.state';

const returnAsArray = (value: Array<unknown> | unknown) => Array.isArray(value) ? value : [];

interface RecursivelyUpdateProcessInstanceSubprocessesParams {
    parentInstanceId: string;
    currentNode: InstanceExtendedWithSubprocesses;
    targetSubprocesses?: InstanceExtendedWithSubprocesses[];
    totalSubprocessesCount?: number;
    page?: number;
}


const recursivelyUpdateProcessInstanceSubprocesses = ({
    parentInstanceId,
    currentNode,
    targetSubprocesses,
    totalSubprocessesCount,
    page,
}: RecursivelyUpdateProcessInstanceSubprocessesParams) => {
    if (currentNode.id === parentInstanceId) {
        currentNode.subprocesses = [...(page === 0 ? [] : returnAsArray(currentNode.subprocesses)), ...returnAsArray(targetSubprocesses)];
        currentNode.subprocessesCount = totalSubprocessesCount;
    }

    currentNode.subprocesses?.forEach(subprocess =>
        recursivelyUpdateProcessInstanceSubprocesses({
            parentInstanceId,
            currentNode: subprocess,
            targetSubprocesses,
            totalSubprocessesCount
        })
    );
};

export const updateProcessInstanceProps = (state: ProcessInstanceState, processInstance: InstanceExtendedWithSubprocesses, page: number = 0) => {
    const { id, subprocesses, hasSubprocesses, isLoadingSubprocesses, subprocessesCount } = processInstance;

    if (!state.all.page?.content) return;

    const pageContent =
    state.all.page?.content
        .map((instance: InstanceExtendedWithSubprocesses) => {
            recursivelyUpdateProcessInstanceSubprocesses({
                parentInstanceId: id,
                currentNode: instance,
                targetSubprocesses: subprocesses,
                totalSubprocessesCount: subprocessesCount,
                page,
            });

            if (instance.id !== id) return instance;

            const updatedInstance = {
                ...instance,
                ...(hasSubprocesses !== undefined && { hasSubprocesses }),
                ...(isLoadingSubprocesses !== undefined && { isLoadingSubprocesses }),
                ...(subprocessesCount !== undefined && { subprocessesCount }),
            };

            return updatedInstance;
        });

    state.all.page.content = pageContent;
};
