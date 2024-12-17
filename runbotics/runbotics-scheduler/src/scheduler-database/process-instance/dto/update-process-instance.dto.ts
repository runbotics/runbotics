import { z } from 'zod';
import { ProcessInstance } from '../process-instance.entity';

export const updateProcessInstanceSchema = z.object({});

export type UpdateProcessInstanceDto = z.infer<
    typeof updateProcessInstanceSchema
> & Partial<ProcessInstance>;
