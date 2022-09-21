import { BPMNElement, getInputParameters } from 'src/views/process/ProcessBuildView/Modeler/BPMN';
import { IGlobalVariable } from 'src/types/model/global-variable.model';

export const CustomActionDescription: Record<string, (element: BPMNElement, supplementarySource?: any[]) => string> = {
    'general.startProcess': (element) => {
        const inputParameters = getInputParameters(element);

        return inputParameters?.processName;
    },
    'variables.assign': (element) => {
        const inputParameters = getInputParameters(element);
        
        if (Array.isArray(inputParameters.variables)) {
            return `Assign to var: ${inputParameters.variables[0].name}`
        }
        return `Assign to var: ${inputParameters.variables}`;
    },
    'variables.assignList': (element) => {
        const inputParameters = getInputParameters(element);

        return `Assign to var: ${inputParameters.variable}`;
    },
    'variables.assignGlobalVariable': (element, supplementarySource) => {
        if (!supplementarySource || !supplementarySource.length) return '';

        const inputParameters = getInputParameters(element);

        return (supplementarySource as IGlobalVariable[])
            .find((variable) => variable.id === inputParameters.globalVariable)?.name ?? '';
    },
};
