/* eslint-disable complexity */
import { UiSchema } from '@rjsf/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';


import { JSONSchema7 } from 'json-schema';
import _ from 'lodash';

import { translate } from '#src-app/hooks/useTranslations';

import store from '#src-app/store';

import {
    BPMNElement, BPMNHelper, findPreviousElements, getInputParameters, getOutputParameters,
} from './BPMN';
import internalBpmnActions from './ConfigureActionPanel/Actions';
import { IBpmnAction } from './ConfigureActionPanel/Actions/types';

import { ActionToBPMNElement } from './ConfigureActionPanel/ActionToBPMNElement';
import { ParameterDestination } from './extensions/palette/CustomPalette';


const DEFAULT_OPTIONS = [
    { value: '${environment.services.run()}', name: translate('Process.Details.Options.ByValue.ContentScript') },
    { value: '${environment.services.desktop()}', name: translate('Process.Details.Options.ByValue.Desktop') },
    {
        value: '${environment.services.backgroundScript()}',
        name: translate('Process.Details.Options.ByValue.BackgroundPage'),
    },
    {
        value: '${environment.services.runHidden()}',
        name: translate('Process.Details.Options.ByValue.HiddenContentScript'),
    },
];

const byValue = DEFAULT_OPTIONS.reduce((accumulator, obj) => {
    accumulator[obj.value] = obj.name;
    return accumulator;
}, {});

export const getExtensionScriptLabel = (implementation: string) => byValue[implementation];
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

const disablePreviousElements = (modeler: BpmnModeler, element: BPMNElement, runFromHere: boolean) => {
    if (runFromHere) {
        const found = findPreviousElements(element);
        const serviceTasks = found.filter(() => is(element, 'bpmn:ServiceTask'));
        const bpmnHelper = BPMNHelper.from(modeler);
        serviceTasks.forEach((serviceTask) => {
            const newServiceTask = serviceTask;
            newServiceTask.businessObject.disabled = true;
            bpmnHelper.updateBusinessObject(newServiceTask);
        });
    } else {
        const found = findPreviousElements(element);
        const serviceTasks = found.filter(() => is(element, 'bpmn:ServiceTask'));
        const bpmnHelper = BPMNHelper.from(modeler);
        serviceTasks.forEach((serviceTask) => {
            const newServiceTask = serviceTask;
            newServiceTask.businessObject.disabled = false;
            bpmnHelper.updateBusinessObject(newServiceTask);
        });
    }
};

export const applyModelerElement = ({ modeler, element, action, additionalParameters }: ApplyModelerElementProps) => {
    const actionToBPMNElement: ActionToBPMNElement = ActionToBPMNElement.from(modeler);

    element.businessObject.disabled = additionalParameters?.disabled;
    if (additionalParameters?.runFromHere !== element.businessObject?.runFromHere) {
        disablePreviousElements(modeler, element, additionalParameters?.runFromHere);
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
        action ? action.form.schema : null,
    );
    if (inputParams.length > 0) { actionToBPMNElement.setInputParameters(element, inputParams); }


    if (additionalParameters?.output && action.output && action.output.assignVariables) {
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
            action ? action.form.schema : null,
        );
        actionToBPMNElement.setOutputParameters(element, outputParams);
    }
};

export const toggleValidationError = (modeler: BpmnModeler, element: BPMNElement, validationError: boolean) => {
    const bpmnHelper = BPMNHelper.from(modeler);
    const newElement = element;
    newElement.businessObject.validationError = validationError;
    bpmnHelper.updateBusinessObject(newElement);
};

export const getActionFromElement = (selectedElement: BPMNElement): IBpmnAction => {
    const actionId = selectedElement
        ? selectedElement.businessObject.actionId
        : undefined;

    if (actionId) {
        const externalBpmnActions = store.getState().action.bpmnActions.byId;
        const externalAction = _.cloneDeep(externalBpmnActions[actionId]);
        return externalAction || internalBpmnActions[actionId];
    }
    return null;
};

export const getFormData = (selectedElement: BPMNElement, action?: IBpmnAction) => {
    if(!selectedElement) return null;
    let selectedAction = action;
    if(!action) selectedAction = getActionFromElement(selectedElement); 
    const { runFromHere, disabled } = selectedElement.businessObject;

    const defaultParameters = {
        ...selectedAction.form.formData,
        disabled,
        runFromHere,
        input: getInputParameters(selectedElement),
    };

    if (selectedAction.output && selectedAction.output.assignVariables) {
        defaultParameters.output = Object.entries(
            getOutputParameters(selectedElement)
        ).reduce((acc, [key], index) => {
            acc[
                Object.keys(defaultParameters.output)[index] ||
                              'variableName'
            ] = key;
            return acc;
        }, {});
    }

    Object.entries(getOutputParameters(selectedElement)).forEach(
        ([key, value]) => {
            if (defaultParameters.output) {
                defaultParameters.output[key] = value;
            }
        }
    );
    return defaultParameters;
};

export const getFormSchema = (selectedElement: BPMNElement, action?: IBpmnAction): JSONSchema7 => { 
    if(!selectedElement) return null;
    let selectedAction = action;
    if(!action) selectedAction = getActionFromElement(selectedElement); 
    
    return ({
        ...selectedAction.form.schema,
        properties: {
            disabled: {
                type: 'boolean',
                title: translate(
                    'Process.Details.Modeler.ActionPanel.Form.Disabled.Title'
                ),
            },
            runFromHere: {
                type: 'boolean',
                title: translate(
                    'Process.Details.Modeler.ActionPanel.Form.RunFromHere.Title'
                ),
            },
            ...selectedAction.form.schema.properties,
        },
    });
};

export const getFormUiSchema = (selectedElement: BPMNElement, action?: IBpmnAction): UiSchema  => {
    if(!selectedElement) return null;
    let selectedAction = action;
    if(!action) selectedAction = getActionFromElement(selectedElement); 

    const cloned = { ...selectedAction.form.uiSchema };
    if (cloned['ui:order']) {
        cloned['ui:order'] = [
            'disabled',
            'runFromHere',
            ...selectedAction.form.uiSchema['ui:order'],
        ];
    }
    return cloned;
};
