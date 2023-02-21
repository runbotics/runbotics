import { is } from 'bpmn-js/lib/util/ModelUtil';

import { useModelerContext } from './useModelerContext';

import { useSelector } from '#src-app/store';
import { globalVariableSelector } from '#src-app/store/slices/GlobalVariable';
import { BPMNElement, CamundaInputOutputElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';


const useProcessGlobalVariables = () => {
    const { globalVariables } = useSelector(globalVariableSelector);
    const context = useModelerContext();

    const assignVariablesElements =
                context?.modeler
                    ?.get('elementRegistry')
                    .filter((element: BPMNElement) => is(element, 'bpmn:Task'))
                    .filter(
                        (element: BPMNElement) =>
                            element.businessObject.actionId ===
                                'variables.assignGlobalVariable'
                    ) ?? [];

    const extractGlobalVariables = (
        inputOutput: CamundaInputOutputElement
    ) => {
        const globalVariableList = inputOutput?.inputParameters.find(
            inputParameter => inputParameter.name === 'globalVariables'
        );

        if (!globalVariableList) {
            return [];
        }
    
        if (globalVariableList) {
            return globalVariableList.definition.items.map(item => {
                const globalVariableName = globalVariables.find(
                    variable => variable.id === Number(item.value)
                )?.name;
    
                if (!globalVariableName) {
                    return [];
                }

                return {value: item.value, name: globalVariableName};
            });
        }

        return [];
    };

    const variables = assignVariablesElements
        .map(assignVariablesElement => {
            const inputOutput: CamundaInputOutputElement =
                        assignVariablesElement.businessObject?.extensionElements
                            ?.values[0];

            if (!inputOutput) {
                return [];
            }

            return (
                extractGlobalVariables(inputOutput)
            );
        })
        .reduce((acc: [], innerArr: []) => acc.concat(innerArr), []);

    return variables;
};

export default useProcessGlobalVariables;
