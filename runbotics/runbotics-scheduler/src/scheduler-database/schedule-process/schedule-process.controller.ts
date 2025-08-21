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
    Patch,
    Query,
} from '@nestjs/common';
import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
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
    @FeatureKeys(FeatureKey.SCHEDULE_READ)
    getAllScheduleProcessesByProcessId(
        @Param('processId', ParseIntPipe) processId: number,
        @UserDecorator() { tenantId }: User,
    ) {
        this.logger.log('REST request to get all schedule processes');
        return this.scheduleProcessService.getAllByProcessId(processId, tenantId);
    }

    @Get(':id')
    @FeatureKeys(FeatureKey.SCHEDULE_READ)
    async getScheduleProcessById(
        @Param('id') id: number,
        @UserDecorator() { tenantId }: User,
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
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to create new schedule for process with id: ', scheduleProcessDto.process.id);
        return this.scheduleProcessService.create(scheduleProcessDto, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @FeatureKeys(FeatureKey.SCHEDULE_DELETE)
    async deleteScheduleProcess(
        @Param('id', ParseIntPipe) id: number,
        @UserDecorator() { tenantId }: User,
    ) {
        this.logger.log('REST request to delete schedule process with id: ', id);
        await this.scheduleProcessService.delete(id, tenantId);
    }
    
    @Patch(':id')
    @FeatureKeys(FeatureKey.SCHEDULE_ADD)
    async updateScheduleProcess(
        @Param('id', ParseIntPipe) id: number,
        @Query('active') active: string,
        @UserDecorator() user: User,
    ) {
        return this.scheduleProcessService.setScheduleActive(id, active, user); 
    }
}
