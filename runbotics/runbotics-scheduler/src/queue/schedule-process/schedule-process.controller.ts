import { QueueService } from '../queue.service';
import {
    Controller,
    Delete,
    Post,
    ParseIntPipe,
    Param,
    Body,
    HttpStatus,
    HttpCode,
    UsePipes,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { ScheduleProcessService } from 'src/database/schedule-process/schedule-process.service';
import { ScheduleProcessEntity } from 'src/database/schedule-process/schedule-process.entity';
import { SchemaValidationPipe } from '../../utils/pipes/schema.validation.pipe';
import { scheduleProcessSchema } from 'src/utils/pipes';
import { AuthRequest } from 'src/types';
import { ProcessService } from 'src/database/process/process.service';
import { Logger } from 'src/utils/logger';
import { FeatureKeys } from 'src/auth/featureKey.decorator';
import { FeatureKey, TriggerEvent } from 'runbotics-common';

@Controller('scheduler/schedule-processes')
export class ScheduleProcessController {
    private readonly logger = new Logger(ScheduleProcessController.name);

    constructor(
        private scheduleProcessService: ScheduleProcessService,
        private queueService: QueueService,
        private processService: ProcessService,
    ) { }

    @FeatureKeys(FeatureKey.SCHEDULE_ADD)
    @Post()
    @UsePipes(new SchemaValidationPipe(scheduleProcessSchema))
    async createScheduleProcess(
        @Body() scheduleProcess: ScheduleProcessEntity,
        @Request() request: AuthRequest,
    ) {
        this.logger.log(`=> Creating schedule for process ${scheduleProcess.process.id}`);

        const process = await this.processService.findById(scheduleProcess.process.id);
        if (!process) {
            throw new BadRequestException('Wrong process id');
        }

        const scheduleProcessWithUser = { ...scheduleProcess, user: request.user, process };
        const newScheduleProcess = await this.scheduleProcessService.save(scheduleProcessWithUser);
        await this.queueService.createScheduledJob({ ...newScheduleProcess, trigger: { name: TriggerEvent.SCHEDULER } });

        this.logger.log(`<= Creation successful: schedule process ${newScheduleProcess.id}`);
        return newScheduleProcess;
    }

    @FeatureKeys(FeatureKey.SCHEDULE_DELETE)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteScheduleProcess(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`=> Deleting schedule process ${id}`);

        await this.scheduleProcessService.delete(id);
        await this.queueService.deleteScheduledJob(id);

        this.logger.log(`<= Deletion successful: schedule process ${id}`);
    }
}
