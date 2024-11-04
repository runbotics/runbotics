import { z } from 'zod';
import { ProcessInstance } from '../process-instance.entity';

export const createProcessInstanceSchema = z.object({});

export type CreateProcessInstanceDto = z.infer<
    typeof createProcessInstanceSchema
> & Omit<ProcessInstance, 'id' | 'user' | 'process' | 'bot'>;
