import { useMemo } from 'react';

import { useModelerContext } from './useModelerContext';

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
    const allActionsWithVariables = rootElement?.businessObject
        ?.flowElements
        .filter(item => item.id.includes('Activity_'));
    
    const allActionVariables = useMemo<ActionVariables>((): ActionVariables => {
        if (!allActionsWithVariables || !canvas) {
            return { inputActionVariables: [], outputActionVariables: [] };
        }

        const inputActionVariables = allActionsWithVariables
            .filter(element => element.actionId === 'variables.assign' ||  element.actionId === 'variables.assignList')
            .map(variable => {
                const variableInfo = variable.extensionElements.values[0].inputParameters;

                if (!variableInfo) {
                    return [];
                }

                const inputVariables = variableInfo
                    .filter((item: ActionVariableObject) => item.name === 'variable')
                    .map(item => ({name: item.value, value: item.name}));

                return inputVariables;
            }).flatMap(item => item[0].value ? item : []);
        
        const outputActionVariables = allActionsWithVariables
            .map(element => {
                const variableInfo = element.extensionElements.values[0].outputParameters;

                if (!variableInfo) {
                    return [];
                }

                return variableInfo
                    .filter((item: ActionVariableObject) => item.name === 'variableName')
                    .map(item => ({name: item.value, value: item.name}));
            }).filter(item => item.length > 0)
            .flatMap(item => item);
            
        return { inputActionVariables, outputActionVariables };
    }, [allActionsWithVariables, canvas]);
      
    return allActionVariables;
};

export default useProcessActionVariables;
