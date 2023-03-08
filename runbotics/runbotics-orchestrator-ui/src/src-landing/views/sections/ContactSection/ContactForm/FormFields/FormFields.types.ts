import { HTMLAttributes } from 'react';

import { FormState } from '../ContactForm.types';

export interface FormInputProps<T> extends HTMLAttributes<T> {
    labelValue: string;
    type: string;
    name: keyof FormState;
    value: string;
    placeholder?: string;
    disabled: boolean;
}

export interface CheckboxProps
    extends Omit<FormInputProps<HTMLInputElement>, 'value'> {
    checked: boolean;
}

export interface SubmitProps
    extends Omit<FormInputProps<HTMLInputElement>, 'name' | 'value' | 'placeholder'> {}
