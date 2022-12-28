import { HTMLAttributes } from 'react';

import { FormState } from '../ContactForm.types';

export interface FormInputProps<T> extends HTMLAttributes<T> {
  labelValue: string;
  type: string;
  name: keyof FormState;
}

export interface SubmitProps
  extends Omit<FormInputProps<HTMLInputElement>, 'name'> {}
