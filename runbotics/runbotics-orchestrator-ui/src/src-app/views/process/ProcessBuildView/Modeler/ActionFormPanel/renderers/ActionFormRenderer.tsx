import React, { FC } from 'react';

import { Box, Grid } from '@mui/material';
import { UiSchema } from '@rjsf/core';
import i18n from 'i18next';
import { JSONSchema7 } from 'json-schema';

import { useModelerContext } from '#src-app/hooks/useModelerContext';

import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import JSONSchemaFormRenderer from './JSONSchemaFormRenderer';
import { FormState } from '../../../../../../Actions/types';
import {
    getFormData,
    getFormSchema,
    getFormUiSchema
} from '../../helpers/elementForm';
import { applyModelerElement } from '../../helpers/elementManipulation';
import { BPMNHelper } from '../../helpers/elementParameters';
import ActionLabelForm from '../ActionLabelForm';
import customWidgets from '../widgets';

const ActionFormRenderer: FC = () => {
    const { modeler } = useModelerContext();
    const { selectedElement, selectedAction, commandStack, currentProcessOutputElement } = useSelector(
        state => state.process.modeler
    );
    const dispatch = useDispatch();
    const elementMatchesAction =
        selectedAction.id === selectedElement.businessObject.actionId;

    const defaultUISchema = React.useMemo<UiSchema>(
        () => getFormUiSchema(selectedElement),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedAction.form.uiSchema, i18n.language]
    );

    const defaultSchema = React.useMemo<JSONSchema7>(
        () => getFormSchema(selectedElement),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedAction.form.schema, i18n.language]
    );

    const defaultFormData = React.useMemo(
        () => getFormData(selectedElement, selectedAction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedAction, selectedElement, commandStack.commandStackIdx, i18n.language]
    );

    const handleSubmit = (event: FormState) => {
        // debugger;
        console.log('Submitting form data:', event.formData.input);
        dispatch(processActions.addAppliedAction(selectedElement.id));
        'processOutput' in event.formData && toggleProcessOutput(event);
        applyModelerElement({
            modeler: modeler,
            element: selectedElement,
            action: selectedAction,
            additionalParameters: {
                input: event.formData.input,
                output: event.formData.output,
                disabled: event.formData.disabled,
                runFromHere: event.formData.runFromHere,
                processOutput: event.formData.processOutput
            }
        });
    };

    const updateLabel = (label: string) => {
        const bpmnHelper = BPMNHelper.from(modeler);
        const newElement = selectedElement;
        newElement.businessObject.label = label;
        bpmnHelper.updateBusinessObject(newElement);
    };

    const toggleProcessOutput = (event: FormState) => {
        if (
            defaultFormData.processOutput === false &&
            event.formData.processOutput === true
        ) {

            if (currentProcessOutputElement) {
                const bpmnHelper = BPMNHelper.from(modeler);
                const newElement = currentProcessOutputElement;
                newElement.businessObject.processOutput = false;
                bpmnHelper.updateBusinessObject(newElement);
            }

            dispatch(processActions.setCurrentProcessOutputElement(selectedElement));
        } else if (
            defaultFormData.processOutput === true &&
            event.formData.processOutput === false
        ) {
            dispatch(processActions.setCurrentProcessOutputElement(null));
        }
    };

    return (
        <>
            <Grid item xs={12}>
                <Box px={2} pt={1}>
                    <ActionLabelForm onSubmit={updateLabel} />
                </Box>
            </Grid>
            {defaultFormData && elementMatchesAction ? (
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
