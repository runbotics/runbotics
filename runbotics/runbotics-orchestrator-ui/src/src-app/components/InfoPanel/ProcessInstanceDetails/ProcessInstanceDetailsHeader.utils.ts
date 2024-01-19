import { ProcessInstanceStatus } from 'runbotics-common';

import { isValidJson } from '#src-app/views/action/ActionDetails';
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
    'disabled' in value.businessObject &&
    value.businessObject.disabled === false;

export const isProcessOutputValid = (value: unknown) =>
    value !== undefined &&
    value !== null &&
    typeof value === 'object' &&
    'output' in value &&
    typeof value.output === 'string' &&
    value.output.length &&
    isValidJson(value.output);
