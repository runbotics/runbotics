import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';

import { IBpmnAction } from '#src-app/Actions/types';

import { ActionToBPMNElement } from '../ActionFormPanel/ActionToBPMNElement';
import { ParameterDestination } from '../extensions/palette/CustomPalette';
import {
    BPMNElement,
    BPMNHelper,
    findPreviousElements,
    getInputParameters,
    getOutputParameters,
} from './elementParameters';

interface ApplyModelerElementProps {
    element: BPMNElement;
    modeler: BpmnModeler;
    action: IBpmnAction;
    additionalParameters?: {
        input: { [key: string]: any };
        output: { [key: string]: any };
        disabled?: boolean;
        runFromHere?: boolean;
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
    } else {
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

// eslint-disable-next-line complexity
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

    const data = {
        input: {
            ...getInputParameters(element),
            ...(additionalParameters?.input ?? []),
        },
        output: {
            ...(additionalParameters?.output ?? getOutputParameters(element)),
        },
    };

    const inputParams = actionToBPMNElement.formDataToParameters(
        ParameterDestination.Input,
        data.input,
        action ? action.form.schema : null
    );
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
    Promise.resolve().then(() => bpmnHelper.updateBusinessObject(newElement));
};
