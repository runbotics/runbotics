import { z } from 'zod';
import { ProcessInstanceEvent } from '../process-instance-event.entity';

export const updateProcessInstanceEventSchema = z.object({});

export type UpdateProcessInstanceEventDto = z.infer<
    typeof updateProcessInstanceEventSchema
> &
    Partial<ProcessInstanceEvent>;
