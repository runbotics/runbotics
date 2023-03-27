import { object } from 'yup';

export const startProcessSchema = object({
    variables: object().optional(),
}).optional();