import React, { FC } from 'react';

import { Box, Grid } from '@mui/material';
import { UiSchema } from '@rjsf/core';
import i18n from 'i18next';
import { JSONSchema7 } from 'json-schema';

import useTranslations from '#src-app/hooks/useTranslations';

import { useModelerContext } from '#src-app/providers/ModelerProvider';
import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import { capitalizeFirstLetter } from '#src-app/utils/text';

import { BPMNHelper, getInputParameters, getOutputParameters } from '../BPMN';
import { applyModelerElement } from '../utils';
import ActionLabelForm from './ActionLabelForm';
import { IFormData } from './Actions/types';
import JSONSchemaFormRenderer from './JSONSchemaFormRenderer';
import customWidgets from './widgets';

const ActionFormRenderer: FC = () => {
    const { modelerRef } = useModelerContext();
    const { selectedElement, selectedAction, commandStack } = useSelector(
        (state) => state.process.modeler
    );

    const dispatch = useDispatch();
    const { translate } = useTranslations();

    const defaultUISchema = React.useMemo<UiSchema>(() => {
        const cloned = { ...selectedAction.form.uiSchema };
        if (cloned['ui:order']) {
            cloned['ui:order'] = [
                'disabled',
                'runFromHere',
                ...selectedAction.form.uiSchema['ui:order'],
            ];
        }

        return cloned;
    }, [selectedAction.form.uiSchema]);

    const defaultSchema = React.useMemo<JSONSchema7>(
        () => ({
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
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedAction.form.schema, i18n.language]
    );

    const getActionLabel = () => {
        if (selectedElement.businessObject.label !== '') {
            return selectedElement.businessObject.label;
        }
        return translate(
            //@ts-ignore
            `Process.Details.Modeler.Actions.${capitalizeFirstLetter({
                text: selectedAction.id,
                lowerCaseRest: false,
                delimiter: '.',
                join: '.',
            })}.Label`
        );
    };

    const defaultFormData = React.useMemo(() => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAction, selectedElement, commandStack.commandStackIdx]);

    const handleSubmit = (event: IFormData) => {
        dispatch(processActions.addAppliedAction(selectedElement.id));
        applyModelerElement({
            modeler: modelerRef.current,
            element: selectedElement,
            action: selectedAction,
            additionalParameters: {
                input: event.formData.input,
                output: event.formData.output,
                disabled: event.formData.disabled,
                runFromHere: event.formData.runFromHere,
                validationError: event.formData.validationError,
            },
        });
        if (!event.formData.disabled && event.formData.validationError) {
            dispatch(
                processActions.setError({
                    elementId: selectedElement.id,
                    elementName: getActionLabel(),
                    message: 'message',
                })
            );
        } else {
            dispatch(processActions.removeError(selectedElement.id));
        }
    };

    const updateLabel = (label: string) => {
        const bpmnHelper = BPMNHelper.from(modelerRef.current);
        const newElement = selectedElement;
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
            {defaultFormData &&
               selectedAction.id === selectedElement.businessObject.actionId ? (
                    <JSONSchemaFormRenderer
                        id={selectedElement.id}
                        key={selectedElement.id}
                        schema={defaultSchema}
                        uiSchema={defaultUISchema}
                        formData={defaultFormData}
                        onSubmit={handleSubmit}
                        widgets={customWidgets}
                    />
                ) : null}
        </>
    );
};

export default ActionFormRenderer;
