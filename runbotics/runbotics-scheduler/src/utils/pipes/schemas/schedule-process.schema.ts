import { number, object, string } from 'yup';

export const scheduleProcessSchema = object({
    cron: string().required(),
    process: object({
        id: number().required(),
    }).required()
}).required();
