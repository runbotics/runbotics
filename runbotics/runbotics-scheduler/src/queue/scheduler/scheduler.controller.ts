import {
    Controller, Delete, Get, HttpCode, HttpStatus, Param,
} from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { Public } from '../../auth/guards';
import { Logger } from '../../utils/logger';
import { SchedulerService } from './scheduler.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';

@Controller('scheduler')
export class SchedulerController {
    private readonly logger = new Logger(SchedulerController.name);

    constructor(private readonly schedulerService: SchedulerService) {}

    @Public()
    @Get('healthcheck')
    healthcheck() {
        return 'Scheduler is running';
    }

    @FeatureKeys(FeatureKey.SCHEDULER_PAGE_READ)
    @Get('scheduled-jobs/count')
    async getScheduledJobsCount(
        @UserDecorator() user: User,
    ) {
        return (await this.schedulerService.getScheduledJobs(user)).length;
    }

    @FeatureKeys(FeatureKey.SCHEDULER_PAGE_READ)
    @Get('scheduled-jobs')
    getScheduledJobs(
        @UserDecorator() user: User,
    ) {
        return this.schedulerService.getScheduledJobs(user);
    }

    @FeatureKeys(FeatureKey.SCHEDULER_JOBS_READ)
    @Get('jobs')
    getJobs(
        @UserDecorator() user: User,
    ) {
        return this.schedulerService.getJobs(user);
    }

    @FeatureKeys(FeatureKey.SCHEDULER_PAGE_READ)
    @Get('jobs/waiting')
    getWaitingJobs(
        @UserDecorator() user: User,
    ) {
        return this.schedulerService.getWaitingJobs(user);
    }

    @FeatureKeys(FeatureKey.SCHEDULER_JOBS_DELETE)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('jobs/:id')
    async deleteJobFromQueue(
        @Param('id') id: string,
        @UserDecorator() user: User,
    ) {
        this.logger.log(`=> Deleting waiting ${id}`);
        await this.schedulerService.deleteJobFromQueue(id, user);
        this.logger.log(`<= Deletion successful: Job ${id}`);
    }
}