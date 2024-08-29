import { ZodError } from 'zod';

export const formatZodError = (error: ZodError) => {
    const fieldErrors = error.formErrors.fieldErrors;
    if (Object.keys(fieldErrors).length > 0) {
        return new Error(Object.values(fieldErrors)[0][0]);
    }
    return new Error(error.issues[0].message);
};
