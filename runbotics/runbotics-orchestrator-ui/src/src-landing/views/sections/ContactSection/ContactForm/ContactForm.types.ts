import { ChangeEvent } from 'react';

export type InputProps =
    | {
    type?: 'input';
    event: ChangeEvent<HTMLInputElement>;
}
    | {
    type: 'textarea';
    event: ChangeEvent<HTMLTextAreaElement>;
};

export interface FormState {
    name: string;
    company: string;
    email: string;
    checkbox: boolean;
    message: '';
}

export interface Status {
    type: 'error' | 'success',
    text: string
}
