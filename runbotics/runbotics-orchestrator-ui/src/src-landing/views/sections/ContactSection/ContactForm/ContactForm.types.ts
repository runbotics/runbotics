import { ChangeEvent } from 'react';

import ContactTranslation from '#src-landing/translations/en/landing/contact.json';

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
    message: string;
}
export enum FormStatusType {
    ERROR = 'error',
    SUCCESS = 'success',
    DISABLED = 'disabled',
    LOADING = 'loading',
}
export interface Status {
    type: FormStatusType;
    text: keyof typeof ContactTranslation;
}
