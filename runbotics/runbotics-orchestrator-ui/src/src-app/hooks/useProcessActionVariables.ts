import { useMemo } from 'react';

import {
    BPMNElement,
    ExtensionElement,
    ModdleElement,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { useModelerContext } from './useModelerContext';

import {
    ActionVariableObject,
    ActionVariables,
} from './useProcessVariables.types';

const useProcessActionVariables = () => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas?.getRootElement();
    const allActionsWithVariables: ModdleElement[] =
        rootElement?.businessObject?.flowElements.filter((item: BPMNElement) =>
            item.id.includes('Activity_')
        );

    const allActionVariables = useMemo<ActionVariables>((): ActionVariables => {
        if (!allActionsWithVariables || !canvas) {
            return { inputActionVariables: [], outputActionVariables: [] };
        }

        /**
         * @name inputActionVariables
         * @name outputActionVariables
         * @description Variables used by actions:
         * Variables -> Assign value to variable
         * Variables -> Assign list variable
         */
        const inputActionVariables = allActionsWithVariables
            .filter(
                (element: ModdleElement) =>
                    element.actionId === 'variables.assign' ||
                    element.actionId === 'variables.assignList'
            )
            .map((variable: ModdleElement) => {
                const variableInfo: ExtensionElement[] =
                    variable.extensionElements.values[0].inputParameters;

                if (!variableInfo) {
                    return [];
                }

                const inputVariables = variableInfo
                    .filter(
                        (item: ActionVariableObject) => item.name === 'variable'
                    )
                    .map((item: ActionVariableObject) => ({
                        name: item.value,
                        value: item.name,
                    }));

                return inputVariables;
            })
            .flatMap((variable: ActionVariableObject[]) =>
                variable[0].name ? variable : []
            );

        const outputActionVariables = allActionsWithVariables
            .map((element: ModdleElement) => {
                const variableInfo: ExtensionElement[] =
                    element.extensionElements.values[0].outputParameters;

                if (!variableInfo) {
                    return [];
                }

                const outputVariables = variableInfo
                    .filter(
                        (item: ActionVariableObject) =>
                            item.name === 'variableName'
                    )
                    .map((item: ActionVariableObject) => ({
                        name: item.value,
                        value: item.name,
                    }));

                return outputVariables;
            })
            .filter((item: ActionVariableObject[]) => item.length > 0)
            .flat();

        return { inputActionVariables, outputActionVariables };
    }, [allActionsWithVariables, canvas]);

    return allActionVariables;
};

export default useProcessActionVariables;
