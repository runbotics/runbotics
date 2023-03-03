import { useMemo } from 'react';

import { useModelerContext } from './useModelerContext';

import { BPMNElement, ModdleElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

export interface ActionVariableObject {
    name?: string,
    value?: string
}

interface ActionVariables {
    inputActionVariables: ActionVariableObject[],
    outputActionVariables: ActionVariableObject[]
}

const useProcessActionVariables = () => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas?.getRootElement();
    const allActionsWithVariables: ModdleElement[] = rootElement?.businessObject
        ?.flowElements
        .filter((item: BPMNElement) => item.id.includes('Activity_'));
    
    const allActionVariables = useMemo<ActionVariables>((): ActionVariables => {
        if (!allActionsWithVariables || !canvas) {
            return { inputActionVariables: [], outputActionVariables: [] };
        }

        // for inputActionVariables variable info object is in .inputParameters
        // for outputActionVariables variable info object is in .outputParameters

        // variableInfo returns array of 3 MooddleElements which holds:
        // [0] - info about variable name ({name: 'variable})
        // [1] - info about variable value ({name: 'value})
        // [3] - info about script and action itself ({name: 'script})

        const inputActionVariables = allActionsWithVariables
            .filter((element: ModdleElement) => element.actionId === 'variables.assign' ||  element.actionId === 'variables.assignList')
            .map((variable: ModdleElement) => {
                const variableInfo = variable.extensionElements.values[0].inputParameters;
            
                if (!variableInfo) {
                    return [];
                }
                
                const inputVariables = variableInfo
                    .filter((item: ActionVariableObject) => item.name === 'variable')
                    .map((item: ActionVariableObject) => ({name: item.value, value: item.name}));

                return inputVariables;

                // inputVariables returns array of arrays with one element
                // hence flatMap which also filters variables which does not have a name yet
            }).flatMap((variable: ActionVariableObject) => variable[0].name ? variable : []);
        
        const outputActionVariables = allActionsWithVariables
            .map((element: ModdleElement) => {
                const variableInfo = element.extensionElements.values[0].outputParameters;

                if (!variableInfo) {
                    return [];
                }

                return variableInfo
                    .filter((item: ActionVariableObject) => item.name === 'variableName')
                    .map((item: ActionVariableObject) => ({name: item.value, value: item.name}));
            }).filter((item: ActionVariableObject[]) => item.length > 0)
            .flatMap((item: ActionVariableObject) => item);
            
        return { inputActionVariables, outputActionVariables };
    }, [allActionsWithVariables, canvas]);
      
    return allActionVariables;
};

export default useProcessActionVariables;
