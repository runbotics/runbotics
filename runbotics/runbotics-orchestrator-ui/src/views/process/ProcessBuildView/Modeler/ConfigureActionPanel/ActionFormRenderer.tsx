import React, { FC } from 'react';

import { Box, Grid } from '@mui/material';
import { UiSchema } from '@rjsf/core';
import i18n from 'i18next';
import { JSONSchema7 } from 'json-schema';

import useTranslations from 'src/hooks/useTranslations';
import { useBpmnFormContext } from 'src/providers/BpmnForm.provider';
import { useDispatch } from 'src/store';
import { processActions } from 'src/store/slices/Process';

import { BPMNHelper, getInputParameters, getOutputParameters } from '../BPMN';
import { applyModelerElement } from '../utils';
import ActionLabelForm from './ActionLabelForm';
import { IFormData } from './Actions/types';
import JSONSchemaFormRenderer from './JSONSchemaFormRenderer';
import customWidgets from './widgets';


const ActionFormRenderer: FC = () => {
    const { element, modeler, action, commandStack } = useBpmnFormContext();
    const dispatch = useDispatch();
    const { translate } = useTranslations();

    const defaultUISchema = React.useMemo<UiSchema>(() => {
        const cloned = { ...action.form.uiSchema };
        if (cloned['ui:order']) cloned['ui:order'] = ['disabled', 'runFromHere', ...action.form.uiSchema['ui:order']];

        return cloned;
    }, [action.form.uiSchema]);

    const defaultSchema = React.useMemo<JSONSchema7>(
        () => ({
            ...action.form.schema,
            properties: {
                disabled: {
                    type: 'boolean',
                    title: translate('Process.Details.Modeler.ActionPanel.Form.Disabled.Title'),
                },
                runFromHere: {
                    type: 'boolean',
                    title: translate('Process.Details.Modeler.ActionPanel.Form.RunFromHere.Title'),
                },
                ...action.form.schema.properties,
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [action.form.schema, i18n.language],
    );
    const defaultFormData = React.useMemo(() => {
        const defaultParameters = {
            ...action.form.formData,
        };
        const inputParameters = getInputParameters(element);
        defaultParameters.input = { ...inputParameters };

        if (action.output && action.output.assignVariables) {
            const outputParameters = getOutputParameters(element);
            if (Object.entries(outputParameters).length > 0)
            { Object.entries(outputParameters).forEach(([key], index) => {
                defaultParameters.output[
                    Object.keys(defaultParameters.output)[index]
                        ? Object.keys(defaultParameters.output)[index]
                        : 'variableName'
                ] = key;
            }); }
        }

        const outputParameters = getOutputParameters(element);
        Object.entries(outputParameters).forEach(([key, value]) => {
            if (defaultParameters.output) defaultParameters.output[key] = value;
        });

        defaultParameters.disabled = element.businessObject.disabled;
        defaultParameters.runFromHere = element.businessObject.runFromHere;

        return defaultParameters;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, element, commandStack.commandStackIdx]);

    const handleSubmit = (event: IFormData) => {
        dispatch(processActions.addAppliedAction(element.id));
        applyModelerElement({
            modeler,
            element,
            action,
            additionalParameters: {
                input: event.formData.input,
                output: event.formData.output,
                disabled: event.formData.disabled,
                runFromHere: event.formData.runFromHere,
            },
        });
    };
    const updateLabel = (label: string) => {
        const bpmnHelper = BPMNHelper.from(modeler);
        const newElement = element;
        newElement.businessObject.label = label;
        bpmnHelper.updateBusinessObject(newElement);
    };

    return (
        <>
            <Grid item xs={12}>
                <Box px={2} pt={1}>
                    <ActionLabelForm onSubmit={updateLabel} />
                </Box>
            </Grid>
            {defaultFormData && action && (
                <JSONSchemaFormRenderer
                    id={element.id}
                    schema={defaultSchema}
                    uiSchema={defaultUISchema}
                    formData={defaultFormData}
                    onSubmit={handleSubmit}
                    widgets={customWidgets}
                />
            )}
        </>
    );
};

export default ActionFormRenderer;
