import React, { FC, useState } from 'react';

import { JSONSchema7 } from 'json-schema';

import useTranslations from '#src-app/hooks/useTranslations';

import { useModelerContext } from '#src-app/providers/ModelerProvider';

import { useSelector } from '#src-app/store';

import {
    CamundaInputOutputElement,
    getInputParameters,
    getOutputParameters,
} from '../BPMN';
import { ParameterDestination } from '../extensions/palette/CustomPalette';
import { IFormData } from './Actions/types';
import { ActionToBPMNElement } from './ActionToBPMNElement';
import JSONSchemaFormRenderer from './JSONSchemaFormRenderer';

const ElementFormRenderer: FC = () => {
    const { selectedElement } = useSelector((state) => state.process.modeler);
    const { modelerRef } = useModelerContext();
    // eslint-disable-next-line unused-imports/no-unused-vars
    const [submitted, setSubmitted] = useState({});
    const { translate } = useTranslations();

    const schema: JSONSchema7 = React.useMemo(() => {
        const inputOutputElement = selectedElement.businessObject
            ?.extensionElements?.values[0] as CamundaInputOutputElement;
        let inputProperties = {};
        let outputProperties = {};
        if (inputOutputElement) {
            inputProperties = inputOutputElement.inputParameters.reduce(
                (previousValue, currentValue) => {
                    const newPrev = previousValue;
                    newPrev[currentValue.name] = {
                        type: 'string',
                    };
                    return newPrev;
                },
                {}
            );
            outputProperties = inputOutputElement.outputParameters.reduce(
                (previousValue, currentValue) => {
                    const newPrev = previousValue;
                    newPrev[currentValue.name] = {
                        type: 'string',
                    };
                    return newPrev;
                },
                {}
            );
        }

        return {
            type: 'object',

            properties: {
                input: {
                    additionalProperties: {
                        type: 'string',
                    },
                    title: translate(
                        'Process.Details.Modeler.ActionPanel.Form.Element.Input'
                    ),
                    type: 'object',
                    properties: inputProperties,
                    required: [],
                },
                output: {
                    additionalProperties: {
                        type: 'string',
                    },
                    title: translate(
                        'Process.Details.Modeler.ActionPanel.Form.Element.Output'
                    ),
                    type: 'object',
                    properties: outputProperties,
                    required: [],
                },
            },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement]);

    const uiSchema = React.useMemo(() => ({}), []);

    const defaultFormData = React.useMemo(() => {
        const inputOutputElement = selectedElement.businessObject
            ?.extensionElements?.values[0] as CamundaInputOutputElement;
        let input;
        let output = {};
        if (inputOutputElement) {
            input = inputOutputElement.inputParameters.reduce(
                (previousValue, currentValue) => {
                    const newPrev = previousValue;
                    newPrev[currentValue.name] = currentValue.value;
                    return newPrev;
                },
                {}
            );
            output = inputOutputElement.outputParameters.reduce(
                (previousValue, currentValue) => {
                    const newPrev = previousValue;
                    newPrev[currentValue.name] = currentValue.value;
                    return newPrev;
                },
                {}
            );
        }

        return {
            disabled: false,
            input,
            output,
        };
    }, [selectedElement]);

    const handleSubmit = (event: IFormData) => {
        const inputParameters = getInputParameters(selectedElement);
        const outputParameters = getOutputParameters(selectedElement);

        const data: IFormData = {
            input: {
                ...inputParameters,
                ...event.formData.input,
            },
            output: {
                ...outputParameters,
                ...event.formData.output,
            },
        };

        const actionToBPMNElement: ActionToBPMNElement =
            ActionToBPMNElement.from(modelerRef.current);
        const inputParams = actionToBPMNElement.formDataToParameters(
            ParameterDestination.Input,
            data.input
        );
        actionToBPMNElement.setInputParameters(selectedElement, inputParams);

        const outputParams = actionToBPMNElement.formDataToParameters(
            ParameterDestination.Output,
            data.output
        );
        actionToBPMNElement.setOutputParameters(selectedElement, outputParams);

        setSubmitted(event.formData);
    };

    return (
        <>
            {defaultFormData && (
                <JSONSchemaFormRenderer
                    id={selectedElement.id}
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={defaultFormData}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
};

export default ElementFormRenderer;
