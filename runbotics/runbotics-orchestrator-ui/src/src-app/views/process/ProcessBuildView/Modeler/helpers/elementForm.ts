import { UiSchema } from '@rjsf/core';

import { JSONSchema7 } from 'json-schema';

import _ from 'lodash';

import internalBpmnActions from '#src-app/Actions';
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

export const getFormData = (
    selectedElement: BPMNElement,
    action?: IBpmnAction
) => {
    if (!selectedElement) return null;
    let selectedAction = action;
    if (!action) selectedAction = getActionFromElement(selectedElement);
    const { runFromHere, disabled } = selectedElement.businessObject;

    const defaultParameters = {
        ...selectedAction.form.formData,
        disabled,
        runFromHere,
        input: getInputParameters(selectedElement)
    };

    if (selectedAction.output && selectedAction.output.assignVariables) {
        defaultParameters.output = Object.entries(
            getOutputParameters(selectedElement)
        ).reduce((acc, [key], index) => {
            acc[
                Object.keys(defaultParameters.output)[index] || 'variableName'
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

export const getFormSchema = (
    selectedElement: BPMNElement,
    action?: IBpmnAction
): JSONSchema7 => {
    if (!selectedElement) return null;
    let selectedAction = action;
    if (!action) selectedAction = getActionFromElement(selectedElement);

    return {
        ...selectedAction.form.schema,
        properties: {
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
            ...selectedAction.form.schema.properties
        }
    };
};

export const getFormUiSchema = (
    selectedElement: BPMNElement,
    action?: IBpmnAction
): UiSchema => {
    if (!selectedElement) return null;
    let selectedAction = action;
    if (!action) selectedAction = getActionFromElement(selectedElement);

    const cloned = { ...selectedAction.form.uiSchema };
    if (cloned['ui:order']) {
        cloned['ui:order'] = [
            'disabled',
            'runFromHere',
            ...selectedAction.form.uiSchema['ui:order']
        ];
    }
    return cloned;
};
