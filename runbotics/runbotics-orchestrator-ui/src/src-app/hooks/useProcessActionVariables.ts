import { useMemo } from 'react';

import { useModelerContext } from './useModelerContext';

export interface ActionVariableObject {
    name: string,
    value?: string
}

interface ActionVariables {
    inputActionVariables: ActionVariableObject[],
    outputActionVariables: ActionVariableObject[]
}

const useProcessActionVariables = () => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas.getRootElement();
    const allActionsWithVariables = rootElement.businessObject?.flowElements.filter(item => item.id.includes('Activity_'));

    const allActionVariables = useMemo((): ActionVariables => {
        if (!allActionsWithVariables) {
            return {inputActionVariables: [], outputActionVariables: []};
        }

        const inputActionVariables = allActionsWithVariables.map(element => {
            if (element.actionId === 'variables.assign' ||  element.actionId === 'variables.assignList') {
                const variableInfo = element.extensionElements.values[0].inputParameters;
                if (!variableInfo) {
                    return [];
                }

                const inputVariables = variableInfo.filter((item: ActionVariableObject) => item.name === 'variable').map(item => ({name: item.name, value: item.value}));
                return inputVariables;
            }
            
            return [];
        }).flatMap(item => item)
            .filter(item => item.value);
            
        const outputActionVariables = allActionsWithVariables.map(element => {
            const variableInfo = element.extensionElements.values[0].outputParameters;

            if (!variableInfo) {
                return [];
            }

            return variableInfo.filter((item: ActionVariableObject) => item.name === 'variableName').map(item => ({name: item.name, value: item.value}));
        }).filter(item => item.length > 0)
            .flatMap(item => item);
            
        return {inputActionVariables, outputActionVariables};
    }, [allActionsWithVariables]);
      
    return allActionVariables;
};

export default useProcessActionVariables;
