import { z } from 'zod';
import { ProcessInstanceLoopEvent } from '../process-instance-loop-event.entity';

export const createProcessInstanceLoopEventSchema = z.object({});

export type CreateProcessInstanceLoopEventDto = z.infer<
    typeof createProcessInstanceLoopEventSchema
> &
    Omit<ProcessInstanceLoopEvent, 'id' | 'processInstance'>;
