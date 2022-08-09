import { FieldError } from 'react-hook-form';

import { GenericInputParameters, BasicInputReturnType, InputTypes } from './types';
import { useFormContext, JSONFormContextValues } from '../components';
import { JSONSchemaType, JSONSubSchemaInfo } from '../JSONSchema';
import { useAnnotatedSchemaFromPointer } from '../JSONSchema/path-handler';
import { getObjectFromForm } from '../JSONSchema/logic';
import { getError, getNumberMaximum, getNumberMinimum, getNumberStep, getValidator } from './validators';

const getWidth = (currentObject: JSONSchemaType) => {
    if (currentObject.width) return currentObject.width;

    return 12;
};

const getSize = (currentObject: JSONSchemaType) => {
    if (currentObject.size) return currentObject.size;

    return 'medium';
};

export const getGenericInput = (
    formContext: JSONFormContextValues,
    subSchemaInfo: JSONSubSchemaInfo,
    pointer: string,
): BasicInputReturnType => {
    const { JSONSchema, isRequired, objectName } = subSchemaInfo;

    let minimum: number | undefined;
    let maximum: number | undefined;
    let step: number | 'any';

    if (JSONSchema.type === 'number' || JSONSchema.type === 'integer') {
        const stepAndDecimalPlaces = getNumberStep(JSONSchema);
        step = stepAndDecimalPlaces[0];

        minimum = getNumberMinimum(JSONSchema);
        maximum = getNumberMaximum(JSONSchema);
    }

    return {
        width: getWidth(JSONSchema),
        size: getSize(JSONSchema),
        copyToClipboard: JSONSchema.copyToClipboard,
        name: objectName,
        pointer: pointer,
        isRequired: isRequired,
        formContext: formContext,
        type: InputTypes.generic,
        validator: getValidator(subSchemaInfo, formContext.customValidators ?? {}),
        getError: () =>
            getError(
                formContext.errors[pointer] ? (formContext.errors[pointer] as FieldError) : undefined,
                JSONSchema,
                isRequired,
                formContext,
                pointer,
                minimum,
                maximum,
                step,
            ),
        getObject: () => JSONSchema,
        getCurrentValue: () => {
            const value = formContext.getValues()[pointer];
            if (value === undefined && formContext.defaultValues) {
                const defaultValue = formContext.defaultValues[pointer];
                if (defaultValue !== undefined) {
                    return defaultValue;
                } else {
                    return value;
                }
            }
            return value;
        },
    };
};

export const useGenericInput: GenericInputParameters = (pointer) => {
    const formContext = useFormContext();
    const data = getObjectFromForm(formContext.schema, formContext.getValues());

    const subSchemaInfo = useAnnotatedSchemaFromPointer(pointer, data);
    return getGenericInput(formContext, subSchemaInfo, pointer);
};
