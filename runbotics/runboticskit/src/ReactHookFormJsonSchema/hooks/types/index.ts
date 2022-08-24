import React from 'react';
import { RegisterOptions, FieldValues, Control } from 'react-hook-form';

import { ErrorMessage } from '../validators';
import { JSONSchemaType } from '../../JSONSchema';
import { JSONFormContextValues } from '../../components';
import { GridSize } from '@mui/material';
import { ApiResource } from '../../../ApiResource';
import { SelectListOption } from '../../../SelectList';

export enum InputTypes {
    generic = 'generic',
    radio = 'radio',
    select = 'select',
    input = 'input',
    textArea = 'textArea',
    checkbox = 'checkbox',
    date = 'date',
    upload = 'upload',
}

export enum UITypes {
    default = 'default',
    radio = 'radio',
    select = 'select',
    input = 'input',
    hidden = 'hidden',
    password = 'password',
    textArea = 'textArea',
    checkbox = 'checkbox',
    date = 'date',
    upload = 'upload',
}

export interface BasicInputReturnType<O = JSONSchemaType> {
    getError(): ErrorMessage;

    getObject(): O;

    getCurrentValue(): FieldValues;

    formContext: JSONFormContextValues;
    isRequired: boolean;
    name: string;
    type: InputTypes;
    pointer: string;
    validator: RegisterOptions;
    width: GridSize;
    size: 'small' | 'medium';
    copyToClipboard?: boolean;
}

export interface GenericInputParameters {
    (pointer: string): BasicInputReturnType;
}

export interface UseRadioReturnType extends BasicInputReturnType {
    getLabelProps(): React.ComponentProps<'label'>;

    getItems(): string[];

    getItemInputProps(index: number): React.ComponentProps<'input'>;

    getItemLabelProps(index: number): React.ComponentProps<'label'>;
}

export interface UseRadioParameters {
    (pointer: string): UseRadioReturnType;
}

export interface UseCheckboxReturnType extends BasicInputReturnType {
    getItems(): any[];

    getApiResource?(): ApiResource | undefined;

    getItemInputProps(index: number): React.ComponentProps<'input'> & { control: Control };

    getItemLabelProps(index: number): React.ComponentProps<'label'>;

    isSingle: boolean;
    control?: Control;
}

export interface UseCheckboxParameters {
    (pointer: string): UseCheckboxReturnType;
}

export interface UseSelectReturnType extends BasicInputReturnType {
    type: InputTypes.select;

    getLabelProps(): React.ComponentProps<'label'>;

    getItemOptionProps(index: number): React.ComponentProps<'option'>;

    getItems(): SelectListOption[];

    getSelectProps(): React.ComponentProps<'select'> & { control: Control };
}

export interface UseSelectParameters {
    (pointer: string): UseSelectReturnType;
}

export interface UseRawInputReturnType<O = JSONSchemaType> extends BasicInputReturnType<O> {
    getLabelProps(): React.ComponentProps<'label'>;

    getInputProps(): React.ComponentProps<'input'> | any;
}

export interface UseRawInputParameters {
    (baseObject: BasicInputReturnType, inputType: string): UseRawInputReturnType;
}

export interface UseInputParameters {
    (pointer: string): UseRawInputReturnType;
}

export interface UseTextAreaReturnType extends BasicInputReturnType {
    getLabelProps(): React.ComponentProps<'label'>;

    getTextAreaProps(): React.ComponentProps<'textarea'>;
}

export interface UseTextAreaParameters {
    (pointer: string): UseTextAreaReturnType;
}

export interface UseUploadReturnType extends BasicInputReturnType { }

export interface UseUploadParameters {
    (pointer: string): UseUploadReturnType;
}

export type InputReturnTypes =
    | UseRawInputReturnType
    | UseTextAreaReturnType
    | UseSelectReturnType
    | UseRadioReturnType
    | UseCheckboxReturnType
    | UseUploadReturnType;

export type UseObjectReturnType = InputReturnTypes[];

export type UISchemaType = {
    type: UITypes;
    properties?: {
        [key: string]: UISchemaType;
    };
};

export type UseObjectParameters = { pointer: string; UISchema?: UISchemaType };

export interface UseObjectProperties {
    (props: UseObjectParameters): UseObjectReturnType;
}
