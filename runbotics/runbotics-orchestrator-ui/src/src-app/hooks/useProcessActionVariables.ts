import { useMemo } from 'react';

import { useModelerContext } from './useModelerContext';


const useProcessActionVariables = () => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas.getRootElement();
    const allActionsWithVariables = rootElement.businessObject?.flowElements.filter(item => item.id.includes('Activity_'));

    const allActionVariables = useMemo(() => {
        if (allActionsWithVariables) {
            return allActionsWithVariables.map(element => {
                if (element.actionId === 'variables.assign' ||  element.actionId === 'variables.assignList') {
                    const variableInfo = element.extensionElements.values[0].inputParameters;
                    return  variableInfo.filter(item => item.name === 'variable');
                } 
                const variableInfo = element.extensionElements.values[0].outputParameters;
    
                if (!variableInfo || variableInfo.length === 0) {
                    return [];
                }
    
                return variableInfo.filter(item => item.name === 'variableName');

            }).filter(item => item.length > 0 )
                .flatMap(item => item)
                .filter(item => item.value);
        }

        return [];
    }, [allActionsWithVariables]);
      
    return allActionVariables;
};

export default useProcessActionVariables;
