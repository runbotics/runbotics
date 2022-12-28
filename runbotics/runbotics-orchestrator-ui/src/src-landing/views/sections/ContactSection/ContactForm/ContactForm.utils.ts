import { FormState } from '#src-landing/views/sections/ContactSection/ContactForm/ContactForm.types';

export const validate = (
    form: FormState,
    requiredFields: (keyof FormState)[]
) =>
    requiredFields.reduce((acc, field) => {
        if (!form[field]) {
            return false;
        }
        return acc;
    }, true);
