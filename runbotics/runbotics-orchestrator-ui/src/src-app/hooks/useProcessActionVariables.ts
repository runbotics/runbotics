import { useMemo } from 'react';

import { useModelerContext } from './useModelerContext';

interface ActionVariables {
    inputActionVariables: Array<any>,
    outputActionVariables: Array<any>
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

                const inputVariables = variableInfo.filter(item => item.name === 'variable');
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

            return variableInfo.filter(item => item.name === 'variableName');
        }).filter(item => item.length > 0)
            .flatMap(item => item);
            
        return {inputActionVariables, outputActionVariables};
    }, [allActionsWithVariables]);
      
    return allActionVariables;
};

export default useProcessActionVariables;
