import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { Controller, UseInterceptors } from '@nestjs/common';
import { ProcessInstanceEventService } from './process-instance-event.service';

@UseInterceptors(TenantInterceptor)
@Controller('api/scheduler/tenants/:tenantId')
export class ProcessInstanceEventController {
    private readonly logger = new Logger(ProcessInstanceEventController.name);

    constructor(
        private readonly processInstanceEventService: ProcessInstanceEventService
    ) {}
}
