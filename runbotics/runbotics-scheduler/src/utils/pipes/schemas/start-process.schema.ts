import { object } from 'yup';

export const startProcessSchema = object({
    input: object({
        variables: object().optional()
    }).optional(),
}).optional();