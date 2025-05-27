import { UiSchema } from '@rjsf/core';

import { JSONSchema7 } from 'json-schema';

import _ from 'lodash';


import { getInternalBpmnActions } from '#src-app/Actions';
import { IBpmnAction } from '#src-app/Actions/types';
import { translate } from '#src-app/hooks/useTranslations';
import store from '#src-app/store';

import {
    BPMNElement,
    getInputParameters,
    getOutputParameters
} from './elementParameters';

export const getActionFromElement = (
    selectedElement: BPMNElement
): IBpmnAction => {

    const currentInternalBpmnActions = getInternalBpmnActions();

    const actionId = selectedElement
        ? selectedElement.businessObject.actionId
        : undefined;

    if (actionId) {
        const externalBpmnActions = store.getState().action.bpmnActions.byId;
        const { pluginBpmnActions } = store.getState().plugin;
        const externalAction = _.cloneDeep(externalBpmnActions[actionId]);

        return externalAction || currentInternalBpmnActions[actionId] || pluginBpmnActions[actionId];
    }
    return null;
};

export const getFormData = (
    selectedElement: BPMNElement,
    action?: IBpmnAction
) => {
    if (!selectedElement) return null;
    let selectedAction = action;
    if (!action) selectedAction = getActionFromElement(selectedElement);
    const { runFromHere, disabled, processOutput } = selectedElement.businessObject;

    const hasOutput = selectedAction?.form?.schema?.properties?.output;

    const defaultParameters = {
        ...selectedAction?.form.formData,
        disabled,
        runFromHere,
        input: getInputParameters(selectedElement)
    };

    if (selectedAction?.output && selectedAction?.output.assignVariables) {
        defaultParameters.output = Object.entries(
            getOutputParameters(selectedElement)
        ).reduce((acc, [key], index) => {
            const output = defaultParameters.output;
            acc[
                output && Object.keys(defaultParameters.output).length >= index + 1
                    ? Object.keys(defaultParameters.output)[index]
                    : 'variableName'
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

    if (hasOutput) {
        defaultParameters.processOutput = processOutput;
    }

    return defaultParameters;
};

export const getFormSchema = (
    selectedElement: BPMNElement,
): JSONSchema7 => {
    if (!selectedElement) return null;
    const selectedAction = getActionFromElement(selectedElement);

    const hasOutput = selectedAction?.form?.schema?.properties?.output;

    const additionalProperties: JSONSchema7['properties'] = {
        disabled: {
            type: 'boolean',
            title: translate(
                'Process.Details.Modeler.ActionPanel.Form.Disabled.Title'
            )
        },
        runFromHere: {
            type: 'boolean',
            title: translate(
                'Process.Details.Modeler.ActionPanel.Form.RunFromHere.Title'
            )
        },
    };

    if (hasOutput) {
        additionalProperties.processOutput = {
            type: 'boolean',
            title: translate(
                'Process.Details.Modeler.ActionPanel.Form.ProcessOutput.Title'
            )
        };
    }

    return {
        ...selectedAction?.form.schema,
        properties: {
            ...additionalProperties,
            ...selectedAction?.form.schema.properties
        }
    };
};

export const getFormUiSchema = (
    selectedElement: BPMNElement,
): UiSchema => {
    if (!selectedElement) return null;
    const selectedAction = getActionFromElement(selectedElement);

    const hasOutput = selectedAction.form?.schema?.properties?.output;
    const cloned = { ...selectedAction.form.uiSchema };

    if (cloned['ui:order']) {
        cloned['ui:order'] = [
            'disabled',
            'runFromHere'
        ];

        if (hasOutput) {
            cloned['ui:order'].push('processOutput');
        }

        cloned['ui:order'] = [
            ...cloned['ui:order'],
            ...selectedAction.form.uiSchema['ui:order']
        ];
    }
    return cloned;
};
