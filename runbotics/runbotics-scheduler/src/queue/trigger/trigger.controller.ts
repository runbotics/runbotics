import { Body, Controller, Delete, HttpException, HttpStatus, Param, Post, UsePipes } from '@nestjs/common';
import { SchemaValidationPipe } from '../../utils/pipes/schema.validation.pipe';
import { startProcessSchema } from '#/utils/pipes';
import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey, JobData, ProcessInput, TriggerEvent } from 'runbotics-common';
import { QueueService } from '../queue.service';
import { Job, JobId } from 'bull';
import { SchedulerService } from '../scheduler/scheduler.service';
import { checkMessageProperty, checkStatusProperty } from '#/utils/error-message.utils';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';

@Controller('scheduler/trigger')
export class TriggerController {
    private readonly logger = new Logger(TriggerController.name);

    constructor(
        private readonly queueService: QueueService,
        private readonly schedulerService: SchedulerService,
    ) {}

    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EXECUTE)
    @Post(':processId')
    @UsePipes(new SchemaValidationPipe(startProcessSchema))
    async triggerProcess(
        @Param('processId') processId: number,
        @Body() input: ProcessInput,
        @UserDecorator() user: User,
    ) {
        try {
            this.logger.log(`=> Starting process ${processId}`);
            const process = await this.queueService.getProcessById(processId);
            await this.queueService.validateProcessAccess({ process: process, user, triggered: true });

            const { orchestratorProcessInstanceId } = await this.queueService.createInstantJob({
                process,
                input,
                user,
                trigger: { name: TriggerEvent.API },
                triggerData: { userEmail: user.email }
            });
            this.logger.log(`<= Process ${processId} successfully started`);

            return { orchestratorProcessInstanceId };
        } catch (err: unknown) {
            this.logger.error(`<= Process ${processId} failed to start`);

            const message = checkMessageProperty(err) || 'Internal server error';
            const statusCode = checkStatusProperty(err) || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException({ message, statusCode }, statusCode);
        }
    }

    @FeatureKeys(FeatureKey.PROCESS_IS_TRIGGERABLE_EXECUTE)
    @Delete(':jobId')
    async removeProcess(
        @Param('jobId') jobId: JobId,
        @UserDecorator() user: User,
    ) {
        try {
            this.logger.log(`Trying to remove job (${jobId}) from queue`);

            const job: Job<JobData> = await this.schedulerService.getJobById(jobId);
            const process = await this.queueService.getProcessById(job.data.process?.id);
            await this.queueService.validateProcessAccess({ process: process, user, triggered: true });

            this.logger.log(`=> Removing job (${jobId}) from queue`);

            await this.queueService.deleteJobFromQueue(jobId);

            this.logger.log(`<= Job (${jobId}) successfully removed`);
        } catch (err: unknown) {
            this.logger.error(`<= Failed to remove job (${jobId})`);

            const message = checkMessageProperty(err) || 'Internal server error';
            const statusCode = checkStatusProperty(err) || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException({ message, statusCode }, statusCode);
        }
    }
}
