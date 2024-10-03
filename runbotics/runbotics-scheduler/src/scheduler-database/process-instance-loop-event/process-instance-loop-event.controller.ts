import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ProcessInstanceLoopEventService } from './process-instance-loop-event.service';

@UseInterceptors(TenantInterceptor)
@Controller('api/scheduler/tenants/:tenantId')
export class ProcessInstanceLoopEventController {
    private readonly logger = new Logger(
        ProcessInstanceLoopEventController.name
    );

    constructor(
        private readonly processInstanceLoopEventService: ProcessInstanceLoopEventService
    ) {}
}
