import React, { FC } from 'react';

import { Box, Grid } from '@mui/material';
import { UiSchema } from '@rjsf/core';
import i18n from 'i18next';
import { JSONSchema7 } from 'json-schema';

import { useModelerContext } from '#src-app/hooks/useModelerContext';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import { capitalizeFirstLetter } from '#src-app/utils/text';

import { BPMNHelper } from '../BPMN';
import {
    applyModelerElement,
    getFormData,
    getFormSchema,
    getFormUiSchema
} from '../utils';
import ActionLabelForm from './ActionLabelForm';
import { IFormData } from './Actions/types';
import JSONSchemaFormRenderer from './JSONSchemaFormRenderer';
import customWidgets from './widgets';

const ActionFormRenderer: FC = () => {
    const { modelerRef } = useModelerContext();
    const { selectedElement, selectedAction, commandStack } = useSelector(
        state => state.process.modeler
    );

    const dispatch = useDispatch();
    const { translate } = useTranslations();

    const defaultUISchema = React.useMemo<UiSchema>(
        () => getFormUiSchema(selectedElement, selectedAction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedAction.form.uiSchema]
    );

    const defaultSchema = React.useMemo<JSONSchema7>(
        () => getFormSchema(selectedElement, selectedAction),
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
                join: '.'
            })}.Label`
        );
    };

    const defaultFormData = React.useMemo(
        () => getFormData(selectedElement, selectedAction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedAction, selectedElement, commandStack.commandStackIdx]
    );

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
                runFromHere: event.formData.runFromHere
            }
        });
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
