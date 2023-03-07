import { FormState } from '#src-landing/views/sections/ContactSection/ContactForm/ContactForm.types';

export const validate = (
    form: FormState,
    requiredFields: (keyof FormState)[]
) => requiredFields.every((field) => form[field]);

export const initialFormState: FormState = {
    name: '',
    company: '',
    email: '',
    checkbox: false,
    message: '',
};
