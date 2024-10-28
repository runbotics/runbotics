import {
    Controller,
    Delete,
    Post,
    ParseIntPipe,
    Param,
    Body,
    HttpStatus,
    HttpCode,
    Get,
    NotFoundException,
    UseInterceptors,
} from '@nestjs/common';
import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { User } from '#/utils/decorators/user.decorator';
import { UserEntity } from '#/database/user/user.entity';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { CreateScheduleProcessDto, createScheduleProcessSchema } from './dto/create-schedule-process.dto';
import { ScheduleProcessService } from './schedule-process.service';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';

@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/schedule-processes')
export class ScheduleProcessController {
    private readonly logger = new Logger(ScheduleProcessController.name);

    constructor(
        private scheduleProcessService: ScheduleProcessService,
    ) { }

    @Get('/processes/:processId')
    getAllScheduleProcessesByProcessId(
        @Param('processId', ParseIntPipe) processId: number,
        @Param('tenantId') tenantId: string,
    ) {
        this.logger.log('REST request to get all schedule processes');
        return this.scheduleProcessService.getAllByProcessId(processId, tenantId);
    }

    @Get(':id')
    async getScheduleProcessById(
        @Param('id') id: number,
        @Param('tenantId') tenantId: string,
    ) {
        this.logger.log('REST request to get schedule process by id: ', id);
        const scheduleProcess = await this.scheduleProcessService.getByIdAndTenantId(id, tenantId);

        if (!scheduleProcess) {
            this.logger.error('Cannot find schedule process',);
            throw new NotFoundException('Scheduled process not found');
        }

        return scheduleProcess;
    }

    @Post()
    @FeatureKeys(FeatureKey.SCHEDULE_ADD)
    createScheduleProcess(
        @Body(new ZodValidationPipe(createScheduleProcessSchema))
        scheduleProcessDto: CreateScheduleProcessDto,
        @User() user: UserEntity
    ) {
        this.logger.log('REST request to create new schedule for process with id: ', scheduleProcessDto.process.id);
        return this.scheduleProcessService.create(scheduleProcessDto, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @FeatureKeys(FeatureKey.SCHEDULE_DELETE)
    async deleteScheduleProcess(@Param('id', ParseIntPipe) id: number) {
        this.logger.log('REST request to delete schedule process with id: ', id);
        await this.scheduleProcessService.delete(id);
    }
}
