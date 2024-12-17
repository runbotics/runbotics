import { z } from 'zod';
import { ProcessInstanceLoopEvent } from '../process-instance-loop-event.entity';

export const updateProcessInstanceLoopEventSchema = z.object({});

export type UpdateProcessInstanceLoopEventDto = z.infer<
    typeof updateProcessInstanceLoopEventSchema
> & Partial<ProcessInstanceLoopEvent>;
