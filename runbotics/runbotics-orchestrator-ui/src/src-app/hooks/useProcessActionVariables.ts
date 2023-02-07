import { useModelerContext } from './useModelerContext';


const useProcessActionVariables = () => {
    const context = useModelerContext();
    const canvas = context?.modeler?.get('canvas');
    const rootElement = canvas.getRootElement();
    const allActionsWithVariables = rootElement.businessObject.flowElements.filter(item => item.id.includes('Activity_'));

    if (!allActionsWithVariables) {
        return [];
    }

    const allActionVariables = allActionsWithVariables.map(element => {
        if (element.actionId === 'variables.assign' ||  element.actionId === 'variables.assignList') {
            const variableInfo = element.extensionElements.values[0].inputParameters;
            return  variableInfo.filter(item => item.name === 'variable');
        } 
        const variableInfo = element.extensionElements.values[0].outputParameters;
    
        if (!variableInfo) {
            return [];
        }
    
        return variableInfo.filter(item => item.name === 'variableName');

    }).filter(item => item.length > 0 ).flatMap(item => item);
      
    return allActionVariables;
};

export default useProcessActionVariables;
