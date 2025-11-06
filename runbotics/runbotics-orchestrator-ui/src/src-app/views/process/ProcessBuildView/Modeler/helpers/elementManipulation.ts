import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';

import { IBpmnAction } from '#src-app/Actions/types';

import {
    BPMNElement,
    BPMNHelper,
    findPreviousElements,
    getInputParameters,
    getOutputParameters,
} from './elementParameters';
import { ActionToBPMNElement } from '../ActionFormPanel/ActionToBPMNElement';
import { ParameterDestination } from '../extensions/palette/CustomPalette';

interface ApplyModelerElementProps {
    element: BPMNElement;
    modeler: BpmnModeler;
    action: IBpmnAction;
    additionalParameters?: {
        input: { [key: string]: any };
        output: { [key: string]: any };
        disabled?: boolean;
        runFromHere?: boolean;
        processOutput?: boolean;
        validationError?: boolean;
    };
}

const disablePreviousElements = (
    modeler: BpmnModeler,
    element: BPMNElement,
    runFromHere: boolean
) => {
    if (runFromHere) {
        const found = findPreviousElements(element);
        const serviceTasks = found.filter(() =>
            is(element, 'bpmn:ServiceTask')
        );
        const bpmnHelper = BPMNHelper.from(modeler);
        serviceTasks.forEach((serviceTask) => {
            const newServiceTask = serviceTask;
            newServiceTask.businessObject.disabled = true;
            bpmnHelper.updateBusinessObject(newServiceTask);
        });
    } else if (runFromHere === false) {
        const found = findPreviousElements(element);
        const serviceTasks = found.filter(() =>
            is(element, 'bpmn:ServiceTask')
        );
        const bpmnHelper = BPMNHelper.from(modeler);
        serviceTasks.forEach((serviceTask) => {
            const newServiceTask = serviceTask;
            newServiceTask.businessObject.disabled = false;
            bpmnHelper.updateBusinessObject(newServiceTask);
        });
    }
};

export const applyModelerElement = ({
    modeler,
    element,
    action,
    additionalParameters,
}: ApplyModelerElementProps) => {
    const actionToBPMNElement: ActionToBPMNElement =
        ActionToBPMNElement.from(modeler);

    element.businessObject.disabled = additionalParameters?.disabled;
    if (
        additionalParameters?.runFromHere !==
        element.businessObject?.runFromHere
    ) {
        disablePreviousElements(
            modeler,
            element,
            additionalParameters?.runFromHere
        );
    }

    element.businessObject.runFromHere = additionalParameters?.runFromHere;
    element.businessObject.processOutput = additionalParameters?.processOutput;

    // debugger;
    const data = {
        input: {
            ...getInputParameters(element),
            ...(additionalParameters?.input ?? []),
        },
        output: {
            ...(additionalParameters?.output ?? getOutputParameters(element)),
        },
    };
    console.log('applyModelerElement data:', data);
    const inputParams = actionToBPMNElement.formDataToParameters(
        ParameterDestination.Input,
        data.input,
        action ? action.form.schema : null
    );
    // debugger;
    if (inputParams.length > 0) {
        actionToBPMNElement.setInputParameters(element, inputParams);
    }

    if (
        additionalParameters?.output &&
        action.output &&
        action.output.assignVariables
    ) {
        Object.entries(action.output.outputMethods).forEach((currentValue) => {
            const key = currentValue[0];
            const value = currentValue[1];
            const output = data.output[key];
            if (output) {
                Object.entries(data.output).forEach(([k, v]) => {
                    if (value === v || k !== 'variableName') {
                        delete data.output[k];
                    }
                });
                data.output[output] = value;
            }
        });
    }

    if (Object.keys(data.output).length > 0) {
        const outputParams = actionToBPMNElement.formDataToParameters(
            ParameterDestination.Output,
            data.output,
            action ? action.form.schema : null
        );
        actionToBPMNElement.setOutputParameters(element, outputParams);
    }
};

export const toggleValidationError = (
    modeler: BpmnModeler,
    element: BPMNElement,
    validationError: boolean
) => {
    const bpmnHelper = BPMNHelper.from(modeler);
    const newElement = element;
    newElement.businessObject.validationError = validationError;
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            bpmnHelper.updateBusinessObject(newElement);
            resolve();
        }, 0);
    });
};
