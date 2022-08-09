import React from 'react';

import { UseSelectParameters, BasicInputReturnType, UseSelectReturnType, InputTypes } from './types';
import { getNumberMaximum, getNumberMinimum, getNumberStep, toFixed } from './validators';
import { useGenericInput } from './useGenericInput';
import { getEnumAsStringArray } from './validators/getEnum';
import { SelectListOption } from '../../SelectList';

const getSelectId = (pointer: string): string => {
    return pointer + '-select';
};

const getOptionId = (pointer: string, index: number, items: SelectListOption[]): string => {
    return pointer + '-select-option-' + (items[index] ? items[index] : '');
};

export const getSelectCustomFields = (baseInput: BasicInputReturnType): UseSelectReturnType => {
    const { register, control } = baseInput.formContext;
    const { validator } = baseInput;

    const currentObject = baseInput.getObject();

    let items: SelectListOption[] = [];
    let minimum: number | undefined;
    let maximum: number | undefined;
    let step: number | 'any';
    let decimalPlaces: number | undefined;

    if (currentObject.type === 'string') {
        if (currentObject.items.type == 'data') {
            items = currentObject.items.data;
        }
    } else if (currentObject.type === 'array') {
        if (currentObject.items.type == 'data') {
            items = currentObject.items.data;
        }
    }

    // if (currentObject.type === 'string') {
    //     items = items.concat(getEnumAsStringArray(currentObject));
    // } else if (
    //     currentObject.type === 'number' ||
    //     currentObject.type === 'integer'
    // ) {
    //     const stepAndDecimalPlaces = getNumberStep(currentObject);
    //     step = stepAndDecimalPlaces[0];
    //     decimalPlaces = stepAndDecimalPlaces[1];
    //
    //     minimum = getNumberMinimum(currentObject);
    //     maximum = getNumberMaximum(currentObject);
    //
    //     if (minimum !== undefined && maximum !== undefined && step != 'any') {
    //         for (let i = minimum; i <= maximum; i += step) {
    //             items.push(toFixed(i, decimalPlaces ? decimalPlaces : 0));
    //         }
    //     }
    // } else if (currentObject.type === 'boolean') {
    //     items = ['true', 'false'];
    // }

    return {
        ...baseInput,
        type: InputTypes.select,
        validator,
        getLabelProps: () => {
            const labelProps: React.ComponentProps<'label'> = {};
            labelProps.id = baseInput.pointer + '-label';
            labelProps.htmlFor = getSelectId(baseInput.pointer);

            return labelProps;
        },
        getSelectProps: () => {
            const itemProps: any = {};
            itemProps.name = baseInput.pointer;
            // itemProps.ref = register(validator);
            itemProps.control = control;
            itemProps.required = baseInput.isRequired;
            itemProps.id = getSelectId(baseInput.pointer);
            return itemProps;
        },
        getItemOptionProps: (index) => {
            const itemProps: React.ComponentProps<'option'> = {};
            itemProps.id = getOptionId(baseInput.pointer, index, items);
            itemProps.value = items[index].value;
            itemProps.label = items[index].label;
            return itemProps;
        },
        getItems: () => items,
    };
};

export const useSelect: UseSelectParameters = (pointer) => {
    return getSelectCustomFields(useGenericInput(pointer));
};
