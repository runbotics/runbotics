import { IProcessInstance, ProcessInstanceStatus } from 'runbotics-common';

import { isValidJson } from '#src-app/utils/isValidJson';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';


export const isProcessInstanceActive = (
    status: ProcessInstanceStatus,
) => status === ProcessInstanceStatus.INITIALIZING
    || status === ProcessInstanceStatus.IN_PROGRESS;

export const isElementEnabled = (value: BPMNElement | undefined) =>
    value !== undefined &&
    value !== null &&
    typeof value === 'object' &&
    'businessObject' in value &&
    typeof value.businessObject === 'object' &&
    'disabled' in value.businessObject &&
    !value.businessObject.disabled;

export const isProcessOutputValid = (value: unknown) =>
    value !== undefined &&
    value !== null &&
    typeof value === 'object' &&
    'output' in value &&
    typeof value.output === 'string' &&
    value.output.length &&
    isValidJson(value.output);

export const hasProcessOutputProperty = (output: IProcessInstance['output']) => {
    if (typeof output !== 'string' || !isValidJson(output)) return false;

    const outputValue: unknown = JSON.parse(output);
    return typeof outputValue === 'object' &&
        'processOutput' in outputValue &&
        typeof outputValue.processOutput === 'object' &&
        !!Object.values(outputValue.processOutput).length;
};
