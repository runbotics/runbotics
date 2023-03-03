import { is } from 'bpmn-js/lib/util/ModelUtil';


import { useModelerContext } from './useModelerContext';

import { useSelector } from '#src-app/store';
import { globalVariableSelector } from '#src-app/store/slices/GlobalVariable';
import { BPMNElement, CamundaInputOutputElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';


interface GlobalVariable {
    value: string,
    name: string
}

const useProcessGlobalVariables = (): GlobalVariable[] => {
    const { globalVariables } = useSelector(globalVariableSelector);
    const context = useModelerContext();

    const assignVariablesElements = context?.modeler
        ?.get('elementRegistry')
        .filter((element: BPMNElement) => is(element, 'bpmn:Task') 
                && element.businessObject.actionId === 'variables.assignGlobalVariable')
            ?? [];

    const extractGlobalVariables = (
        inputOutput: CamundaInputOutputElement
    ) => {
        const globalVariableList = inputOutput?.inputParameters.find(
            inputParameter => inputParameter.name === 'globalVariables'
        );

        if (!globalVariableList) {
            return [];
        }
        
        return globalVariableList.definition.items.map(item => {
            const globalVariableName = globalVariables.find(
                variable => variable.id === Number(item.value)
            )?.name;
    
            if (!globalVariableName) {
                return [];
            }

            return { value: item.value, name: globalVariableName };
        });
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
        .reduce((acc: GlobalVariable[], innerArr: []) => acc.concat(innerArr.flatMap(item => item)), []);

    return variables;
};

export default useProcessGlobalVariables;
