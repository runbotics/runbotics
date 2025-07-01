import { is } from 'bpmn-js/lib/util/ModelUtil';

import { BpmnElementType } from 'runbotics-common';

import { useSelector } from '#src-app/store';
import { globalVariableSelector } from '#src-app/store/slices/GlobalVariable';
import {
    BPMNElement,
    CamundaInputOutputElement,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { useModelerContext } from './useModelerContext';
import { GlobalVariable } from './useProcessVariables.types';

const useProcessGlobalVariables = (): GlobalVariable[] => {
    const { globalVariables } = useSelector(globalVariableSelector);
    const context = useModelerContext();

    const assignVariablesElements =
        context?.modeler
            ?.get('elementRegistry')
            .filter(
                (element: BPMNElement) =>
                    is(element, BpmnElementType.TASK) &&
                    element.businessObject.actionId ===
                        'variables.assignGlobalVariable'
            ) ?? [];

    const extractGlobalVariables = (inputOutput: CamundaInputOutputElement) => {
        const globalVariableList = inputOutput?.inputParameters.find(
            (inputParameter) => inputParameter.name === 'globalVariables'
        );

        if (!globalVariableList) {
            return [];
        }

        return globalVariableList.definition.items.map((item) => {
            const globalVariableName = globalVariables.content.find(
                (variable) => variable.id === Number(item.value)
            )?.name;

            if (!globalVariableName) {
                return [];
            }

            return { value: item.value, name: globalVariableName };
        });
    };

    const variables = assignVariablesElements
        .map((assignVariablesElement) => {
            const inputOutput: CamundaInputOutputElement =
                assignVariablesElement.businessObject?.extensionElements
                    ?.values[0];

            if (!inputOutput) {
                return [];
            }

            return extractGlobalVariables(inputOutput);
        })
        .reduce((acc: GlobalVariable[], innerArr: GlobalVariable[]) => {
            acc.push(...innerArr);
            return acc;
        }, []);

    return variables;
};

export default useProcessGlobalVariables;
