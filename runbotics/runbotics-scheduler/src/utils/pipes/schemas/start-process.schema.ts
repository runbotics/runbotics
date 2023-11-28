import { object, string } from 'yup';

export const startProcessSchema = object({
    variables: object().optional(),
    notificationUrl: string().optional(),
}).optional();