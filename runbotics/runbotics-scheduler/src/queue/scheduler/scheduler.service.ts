import { ProcessService } from '#/scheduler-database/process/process.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JobInformation, JobStatus, Queue } from 'bull';
import { Job } from '#/utils/process';
import { Logger } from '#/utils/logger';

import { JobData, WsMessage } from 'runbotics-common';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import { ScheduleProcessService } from '#/scheduler-database/schedule-process/schedule-process.service';

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
    ) {}

    async addAdditionalInfoToScheduledJobs(scheduledJobs: JobInformation[]) {
        return Promise.all(
            scheduledJobs.map(async (scheduledJob) => {
                const scheduledJobId = Number(scheduledJob.id);
                const scheduleProcess = await this.scheduleProcessService.getById(scheduledJobId);

                return {
                    ...scheduledJob,
                    ...scheduleProcess,
                };
            })
        );
    }

    async getScheduledJobs() {
        this.logger.log('Getting scheduled jobs');
        const scheduledJobs = await this.processQueue.getRepeatableJobs();
        const extendedScheduledJobs = await this.addAdditionalInfoToScheduledJobs(
            scheduledJobs
        );

        this.logger.log(
            `Successfully got ${extendedScheduledJobs.length} scheduled job(s)`
        );
        return extendedScheduledJobs;
    }

    async deleteJobFromQueue(id: string) {
        this.logger.log(`Deleting waiting job with id: ${id}`);
        const job = await this.processQueue.getJob(id);

        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);
        await job?.remove();
        this.logger.log(`QueueJob with id: ${id} successfully deleted`);
    }

    private async updateProcessForScheduledJob(jobs: Job[]) {
        return Promise.all(jobs.map(async (job) => {
            const process = await this.processService.findById(Number(job.data.process.id));
            job.data.process = { ...process };
            return job;
        }));
    }

    async getJobs() {
        this.logger.log('Getting jobs');
        const jobs = await this.processQueue.getJobs(QUEUE_JOB_STATUSES);
        const jobsWithProcesses = await this.updateProcessForScheduledJob(jobs);
        this.logger.log(`Successfully got ${jobs.length} job(s)`);
        return jobsWithProcesses;
    }

    async getWaitingJobs(): Promise<Job[]> {
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


        this.logger.log(`Successfully got ${jobs.length} waiting job(s)`);
        return jobs;
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
