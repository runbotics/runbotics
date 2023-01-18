import { IGlobalVariable } from '#src-app/types/model/global-variable.model';
import {
    BPMNElement,
    getInputParameters
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

export const CustomActionDescription: Record<
    string,
    (element: BPMNElement, supplementarySource?: any[]) => string
> = {
    'general.startProcess': element => {
        const inputParameters = getInputParameters(element);

        return inputParameters?.processName;
    },
    'variables.assign': element => {
        const inputParameters = getInputParameters(element);

        return `Assign to var: ${inputParameters.variable}`;
    },
    'variables.assignList': element => {
        const inputParameters = getInputParameters(element);

        return `Assign to var: ${inputParameters.variable}`;
    },
    'variables.assignGlobalVariable': (element, supplementarySource) => {
        if (!supplementarySource || !supplementarySource.length) return '';

        const inputParameters = getInputParameters(element);

        return (
            (supplementarySource as IGlobalVariable[]).find(
                variable => variable.id === inputParameters.globalVariable
            )?.name ?? ''
        );
    }
};
