import { ProcessService } from '#/scheduler-database/process/process.service';
import { InjectQueue } from '@nestjs/bull';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JobId, JobInformation, JobStatus, Queue } from 'bull';
import { Job } from '#/utils/process';
import { Logger } from '#/utils/logger';

import { JobData, WsMessage } from 'runbotics-common';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import { ScheduleProcessService } from '#/scheduler-database/schedule-process/schedule-process.service';
import { User } from '#/scheduler-database/user/user.entity';

const QUEUE_JOB_STATUSES: JobStatus[] = [
    'waiting',
    'active',
    'paused',
    'delayed',
];

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        @InjectQueue('scheduler') private readonly processQueue: Queue<JobData>,
        private readonly processService: ProcessService,
        private readonly scheduleProcessService: ScheduleProcessService,
        private readonly uiGateway: UiGateway,
    ) {
    }

    async addAdditionalInfoToScheduledJobs(scheduledJobs: JobInformation[]) {
        return Promise.all(
            scheduledJobs.map(async (scheduledJob) => {
                const scheduledJobId = Number(scheduledJob.id);
                const scheduleProcess = await this.scheduleProcessService.getById(scheduledJobId);

                return {
                    ...scheduledJob,
                    ...scheduleProcess,
                };
            }),
        );
    }

    async getScheduledJobs(user: User) {
        this.logger.log('Getting scheduled jobs');
        const scheduledJobs = await this.processQueue.getRepeatableJobs();
        const extendedScheduledJobs = await this.addAdditionalInfoToScheduledJobs(
            scheduledJobs,
        );
        const filteredExtendedScheduledJobs = extendedScheduledJobs
            .filter((job) => job.process?.tenantId === user.tenantId);

        this.logger.log(
            `Successfully got ${filteredExtendedScheduledJobs.length} scheduled job(s)`,
        );
        return filteredExtendedScheduledJobs;
    }

    async deleteJobFromQueue(id: JobId, user: User) {
        this.logger.log(`Deleting waiting job with id: ${id}`);
        const job = await this.processQueue.getJob(id);
        if (!job) {
            throw new NotFoundException(`Job with id: ${id} does not exist.`);
        }
        if (job.data.process.tenantId === user.tenantId) {
            throw new ForbiddenException();
        }

        const tenantRoom = job.data.process.tenantId;
        this.uiGateway.emitTenant(tenantRoom, WsMessage.REMOVE_WAITING_SCHEDULE, job);
        await job?.remove();
        this.logger.log(`QueueJob with id: ${id} successfully deleted`);
    }

    async deleteRepeatableJob(id: JobId, user: User) {
        this.logger.log(`Deleting repeatable job with id: ${id}`);
        const jobInformation = await this.processQueue.getRepeatableJobs();
        
        const job = jobInformation.find(job => job.id === id);
        
        if(!job) {
            throw new NotFoundException(`Job with id: ${id} does not exist.`);
        }
        this.uiGateway.emitTenant(user.tenantId, WsMessage.REMOVE_SCHEDULE_PROCESS, job);
        await this.processQueue.removeRepeatableByKey(job.key);
        this.logger.log(`QueueJob with id: ${job.id} successfully deleted`);
    }

    private async updateProcessForScheduledJob(jobs: Job[]) {
        return Promise.all(jobs.map(async (job) => {
            const process = await this.processService.findById(Number(job.data.process.id));
            job.data.process = { ...process };
            return job;
        }));
    }

    async getJobs(user: User) {
        this.logger.log('Getting jobs');
        const jobs = await this.processQueue.getJobs(QUEUE_JOB_STATUSES);
        const jobsWithProcesses = await this.updateProcessForScheduledJob(jobs);
        const filteredJobsWithProcesses = jobsWithProcesses
            .filter(job => job.data.process.tenantId === user.tenantId);
        this.logger.log(`Successfully got ${filteredJobsWithProcesses.length} job(s)`);
        return filteredJobsWithProcesses;
    }

    async getWaitingJobs(user: User): Promise<Job[]> {
        this.logger.log('Getting waiting jobs');
        const waitingJobs = await this.processQueue.getJobs(['waiting']) as Job[];
        const activeJobs = await this.processQueue.getJobs(['active']) as Job[];
        const waitingJobsWithProcesses = await this.updateProcessForScheduledJob(waitingJobs);
        const activeJobsWithProcesses = await this.updateProcessForScheduledJob(activeJobs);
        const newActive = activeJobsWithProcesses.map((job) => {
            job.data = { ...job.data, isActive: true };
            return job;
        });
        const jobs = [...waitingJobsWithProcesses, ...newActive];
        const filteredJobs = jobs
            .filter(job => job.data.process.tenantId === user.tenantId);

        this.logger.log(`Successfully got ${filteredJobs.length} waiting job(s)`);
        return filteredJobs;
    }

    async getJobById(id: number | string) {
        const job = await this.processQueue.getJob(id);
        if (!job || !job?.data) {
            return Promise.reject(new NotFoundException(`Job with jobId (${id}) was not found.`));
        }
        const process = await this.processService.findById(Number(job.data.process.id));
        job.data.process = { ...process };
        return job;
    }
}
