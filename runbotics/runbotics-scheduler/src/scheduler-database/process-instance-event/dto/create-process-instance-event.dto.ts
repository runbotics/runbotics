import { z } from 'zod';
import { ProcessInstanceEvent } from '../process-instance-event.entity';

export const createProcessInstanceEventSchema = z.object({});

export type CreateProcessInstanceEventDto = z.infer<
    typeof createProcessInstanceEventSchema
> & Omit<ProcessInstanceEvent, 'id' | 'processInstance'>;
