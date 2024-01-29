import { object, string } from 'yup';

export const startProcessSchema = object({
    variables: object().optional(),
    callbackUrl: string().optional(),
}).optional();