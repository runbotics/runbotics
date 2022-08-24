import React from 'react';

import { UseRawInputParameters, BasicInputReturnType, UseRawInputReturnType, InputTypes } from './types';
import { getNumberMaximum, getNumberMinimum, getNumberStep, toFixed } from './validators';

const getInputId = (pointer: string, inputType: string): string => {
    return pointer + '-' + inputType + '-input';
};

const getLabelId = (pointer: string, inputType: string): string => {
    return pointer + '-' + inputType + '-label';
};

export const getRawInputCustomFields = (baseInput: BasicInputReturnType, inputType: string): UseRawInputReturnType => {
    const { register, control } = baseInput.formContext;
    const { validator } = baseInput;

    const currentObject = baseInput.getObject();

    let minimum: number | undefined;
    let maximum: number | undefined;
    let step: number | 'any';
    let decimalPlaces: number | undefined;

    const itemProps: any = { key: '' };
    if (currentObject.type === 'string') {
        itemProps.pattern = currentObject.pattern;
        itemProps.minLength = currentObject.minLength;
        itemProps.maxLength = currentObject.maxLength;
    } else if (currentObject.type === 'number' || currentObject.type === 'integer') {
        const stepAndDecimalPlaces = getNumberStep(currentObject);
        step = stepAndDecimalPlaces[0];
        decimalPlaces = stepAndDecimalPlaces[1];

        minimum = getNumberMinimum(currentObject);
        maximum = getNumberMaximum(currentObject);

        itemProps.min = `${minimum}`;
        itemProps.max = `${maximum}`;
        itemProps.step = step === 'any' ? 'any' : toFixed(step, decimalPlaces ? decimalPlaces : 0);
    }

    return {
        ...baseInput,
        type: InputTypes.input,
        getLabelProps: () => {
            const itemProps: React.ComponentProps<'label'> = {};
            itemProps.id = getLabelId(baseInput.pointer, inputType);
            itemProps.htmlFor = getInputId(baseInput.pointer, inputType);

            return itemProps;
        },
        getInputProps: () => {
            itemProps.name = baseInput.pointer;
            itemProps.ref = register(validator);
            itemProps.control = control;
            itemProps.validator = validator;
            itemProps.type = inputType;
            itemProps.required = baseInput.isRequired;
            itemProps.id = getInputId(baseInput.pointer, inputType);
            itemProps.key = getInputId(baseInput.pointer, inputType);
            return itemProps;
        },
    };
};

export const useRawInput: UseRawInputParameters = (baseObject, inputType) => {
    return getRawInputCustomFields(baseObject, inputType);
};
