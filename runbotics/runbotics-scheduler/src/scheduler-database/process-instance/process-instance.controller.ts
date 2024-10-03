import { Controller, UseInterceptors } from '@nestjs/common';
import { ProcessInstanceService } from './process-instance.service';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';

@UseInterceptors(TenantInterceptor)
@Controller('api/scheduler/tenants/:tenantId')
export class ProcessInstanceController {
    private readonly logger = new Logger(ProcessInstanceController.name);

    constructor(
        private readonly processInstanceService: ProcessInstanceService
    ) {}
}
