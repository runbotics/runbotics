import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ProcessInstanceLoopEventService } from './process-instance-loop-event.service';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { UserEntity } from '#/database/user/user.entity';
import { User } from '#/utils/decorators/user.decorator';
import { ProcessInstanceLoopEvent } from './process-instance-loop-event.entity';

@UseInterceptors(TenantInterceptor)
@FeatureKeys(FeatureKey.PROCESS_INSTANCE_EVENT_READ)
@Controller('api/scheduler/tenants/:tenantId/process-instance-loop-events')
export class ProcessInstanceLoopEventController {
    private readonly logger = new Logger(
        ProcessInstanceLoopEventController.name
    );

    constructor(
        private readonly processInstanceLoopEventService: ProcessInstanceLoopEventService
    ) {}

    @Get(':loopId')
    getLoopEvents(
        @Param('loopId') loopId: ProcessInstanceLoopEvent['loopId'],
        @User() user: UserEntity
    ) {
        return this.processInstanceLoopEventService.getLoopEvents(loopId, user);
    }
}
