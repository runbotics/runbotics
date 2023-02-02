import { getProcessVariables } from '@bpmn-io/extract-process-variables';

import { useSelector } from '#src-app/store';
import { globalVariableSelector } from '#src-app/store/slices/GlobalVariable';

import { currentProcessSelector } from '#src-app/store/slices/Process';

import { useModelerContext } from './useModelerContext';

export enum VariableTag {
    Global = 'GLOBAL',
    InputOutput = 'INPUT/OUTPUT',
    ActionAssigned = 'ACTION ASSIGNED',
}

const useProcessVariables = () => {
    const { globalVariables } = useSelector(globalVariableSelector);
    const context = useModelerContext();
    const { executionInfo, isAttended } = useSelector(currentProcessSelector);
    const { passedInVariables } = useSelector((state) => state.process.modeler);

    const getActionVariables = () => {
        const canvas = context?.modeler?.get('canvas');
        const rootElement = canvas.getRootElement();
        const processVariables = getProcessVariables(
            rootElement.businessObject
        );

        return processVariables;
    };

    const taggedActionVariables = getActionVariables().map(
        (actionVariable) => ({
            name: `#{${actionVariable.name}}`,
            tag: VariableTag.ActionAssigned,
        })
    );

    const taggedGlobalVariables =
        globalVariables.length > 0
            ? globalVariables.map((item) => ({
                name: `#{${item.name}}`,
                tag: VariableTag.Global,
            }))
            : [];

    const taggedAttendedVariables =
        isAttended && executionInfo
            ? passedInVariables.map((variable) => ({
                name: `#{${variable}}`,
                tag: VariableTag.InputOutput,
            }))
            : [];

    // console.log(passedInVariables);
    console.log('globalVariables', taggedGlobalVariables);
    console.log('actionVariables', taggedActionVariables);
    console.log('attended', taggedAttendedVariables);

    // console.log('attended', attendedProcessVariables);
    return {
        taggedGlobalVariables,
        taggedActionVariables,
        taggedAttendedVariables,
    };
};

export default useProcessVariables;
