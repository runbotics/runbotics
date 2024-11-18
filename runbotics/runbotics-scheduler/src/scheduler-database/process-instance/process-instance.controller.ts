import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ProcessInstanceService } from './process-instance.service';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import {
    Specifiable,
    Specs,
} from '#/utils/specification/specifiable.decorator';
import { ProcessInstanceCriteria } from './criteria/process-instance.criteria';
import { ProcessInstance } from './process-instance.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';

@UseInterceptors(TenantInterceptor)
@FeatureKeys(FeatureKey.PROCESS_INSTANCE_READ)
@Controller('api/scheduler/tenants/:tenantId/process-instances')
export class ProcessInstanceController {
    private readonly logger = new Logger(ProcessInstanceController.name);

    constructor(
        private readonly processInstanceService: ProcessInstanceService
    ) {}

    @Get()
    getAll(
        @Specifiable(ProcessInstanceCriteria) specs: Specs<ProcessInstance>,
        @UserDecorator() user: User
    ) {
        return this.processInstanceService.getAll(user, specs);
    }

    @Get('GetPage')
    getPage(
        @Specifiable(ProcessInstanceCriteria) specs: Specs<ProcessInstance>,
        @Pageable() paging: Paging,
        @UserDecorator() user: User
    ) {
        return this.processInstanceService.getPage(user, specs, paging);
    }

    @Get(':id')
    getOne(@Param('id') id: ProcessInstance['id'], @UserDecorator() user: User) {
        return this.processInstanceService.getOne(id, user);
    }

    @Get(':id/subprocesses/GetPage')
    getSubprocesses(
        @Param('id') id: ProcessInstance['id'],
        @Pageable() paging: Paging,
        @UserDecorator() user: User
    ) {
        return this.processInstanceService.getSubprocesses(id, user, paging);
    }
}
