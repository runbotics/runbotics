import {
    Controller, Delete,
    Get, HttpCode, HttpStatus, Param
} from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';
import { FeatureKeys } from 'src/auth/featureKey.decorator';
import {Public} from '../auth/guards';
import {Logger} from '../utils/logger';
import {SchedulerService} from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
    private readonly logger = new Logger(SchedulerController.name);

    constructor(private readonly schedulerService: SchedulerService) {
    }

    @Public()
    @Get('healthcheck')
    healthcheck() {
        return 'Scheduler is running';
    }

    @FeatureKeys(FeatureKey.SCHEDULER_PAGE_READ)
    @Get('scheduled-jobs/count')
    async getScheduledJobsCount() {
        return (await this.schedulerService.getScheduledJobs()).length;
    }

    @FeatureKeys(FeatureKey.SCHEDULER_PAGE_READ)
    @Get('scheduled-jobs')
    async getScheduledJobs() {
        return await this.schedulerService.getScheduledJobs();
    }

    @FeatureKeys(FeatureKey.SCHEDULER_JOBS_READ)
    @Get('jobs')
    async getJobs() {
        return await this.schedulerService.getJobs();
    }

    @FeatureKeys(FeatureKey.SCHEDULER_PAGE_READ)
    @Get('jobs/waiting')
    async getWaitingJobs() {
        return await this.schedulerService.getWaitingJobs();
    }

    @FeatureKeys(FeatureKey.SCHEDULER_JOBS_DELETE)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('jobs/:id')
    async deleteJobFromQueue(@Param('id') id: string) {
        this.logger.log(`=> Deleting waiting ${id}`);
        await this.schedulerService.deleteJobFromQueue(id);
        this.logger.log(`<= Deletion successful: Job ${id}`);
    }
}