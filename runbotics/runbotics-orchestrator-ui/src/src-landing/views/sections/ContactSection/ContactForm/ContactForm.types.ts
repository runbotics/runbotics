import { ChangeEvent } from 'react';

import ContactTranslation from '#src-landing/translations/en/contact.json';

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

export interface Status {
    type: 'error' | 'success' | 'disabled' | 'loading';
    text: keyof typeof ContactTranslation;
}
