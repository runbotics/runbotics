import { number, object, string } from 'yup';

export const startProcessSchema = object({
    variables: object().optional(),
    callbackUrl: string().optional(),
    queueCallbackUrl: string().optional(),
    timeout: number().optional(),
}).optional();