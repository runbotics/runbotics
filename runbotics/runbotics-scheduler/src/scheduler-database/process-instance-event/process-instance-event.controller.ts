import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseInterceptors,
} from '@nestjs/common';
import { ProcessInstanceEventService } from './process-instance-event.service';
import {
    Specifiable,
    Specs,
} from '#/utils/specification/specifiable.decorator';
import { ProcessInstanceEventCriteria } from './criteria/process-instance-event.criteria';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { User as UserEntity } from '#/scheduler-database/user/user.entity';
import { User } from '#/utils/decorators/user.decorator';
import { ProcessInstanceEvent } from './process-instance-event.entity';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';

@UseInterceptors(TenantInterceptor)
@FeatureKeys(FeatureKey.PROCESS_INSTANCE_EVENT_READ)
@Controller('api/scheduler/tenants/:tenantId/process-instance-events')
export class ProcessInstanceEventController {
    private readonly logger = new Logger(ProcessInstanceEventController.name);

    constructor(
        private readonly processInstanceEventService: ProcessInstanceEventService
    ) {}

    @Get('GetPage')
    getPage(
        @Specifiable(ProcessInstanceEventCriteria)
        specs: Specs<ProcessInstanceEvent>,
        @Pageable() paging: Paging,
        @User() user: UserEntity
    ) {
        return this.processInstanceEventService.getPage(user, specs, paging);
    }

    @Get(':id')
    getOne(
        @Param('id', new ParseIntPipe()) id: ProcessInstanceEvent['id'],
        @User() user: UserEntity
    ) {
        return this.processInstanceEventService.getOne(id, user);
    }
}
