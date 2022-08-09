import {BotSchedulerService} from './bot/bot.scheduler.service';
import {ProcessService} from '../database/process/process.service';
import {InjectQueue} from '@nestjs/bull';
import {Injectable, NotFoundException, OnApplicationBootstrap} from '@nestjs/common';
import {Job, JobInformation, JobStatus, Queue} from 'bull';
import {v4 as uuidv4} from 'uuid';
import {ScheduledProcess} from 'src/types/scheduled-process';
import {Logger} from 'src/utils/logger';
import {InstantProcess, StartProcessRequest, StartProcessResponse} from 'src/types';
import {ScheduleProcessService} from 'src/database/schedule-process/schedule-process.service';
import {IScheduleProcess, WsMessage} from 'runbotics-common';
import {UiGateway} from '../websocket/gateway/ui.gateway';

const QUEUE_JOB_STATUSES: JobStatus[] = ['waiting', 'active', 'paused', 'delayed'];

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(
        @InjectQueue('scheduler') private readonly processQueue: Queue,
        private readonly processService: ProcessService,
        private readonly scheduleProcessService: ScheduleProcessService,
        private readonly botSchedulerService: BotSchedulerService,
        private readonly uiGateway: UiGateway,
    ) {
    }

    async onApplicationBootstrap() {
        await this.botSchedulerService.initializeBotsStatuses();
        const scheduledProcesses = await this.scheduleProcessService.findAll();
        await this.initializeQueue(scheduledProcesses);
    }

    async updateScheduledJobs(scheduledProcess: IScheduleProcess) {
        const schedules = await this.scheduleProcessService.findAllByProcess(scheduledProcess.process.id);
        for (const schedule of schedules) {
            await this.deleteScheduledProcessIfExists(schedule);
            await this.addNewScheduledJob(schedule);
        }
    }

    async addNewScheduledJob(scheduledProcess: IScheduleProcess) {
        this.logger.log(`Adding new scheduled job for process: ${scheduledProcess.process.name}`);

        await this.processQueue.add(
            scheduledProcess,
            {
                repeat: {cron: scheduledProcess.cron},
                jobId: `${scheduledProcess.id}:${scheduledProcess.process.name}:${scheduledProcess.process.id}`,
                removeOnComplete: true,
                removeOnFail: true,
            },
        )
            .then(() => {
                this.uiGateway.server.emit(WsMessage.ADD_SCHEDULE_PROCESS, scheduledProcess);
                this.logger.log(`Process: "${scheduledProcess.process.name}":${scheduledProcess.process.id} successfully scheduled | scheduleID: ${scheduledProcess.id}`);
            })
            .catch(err => this.logger
                .error(`Failed to add new scheduled job for process: ${scheduledProcess.process.name}`, err));
    }

    async addNewInstantJob({ processInfo, ...rest }: StartProcessRequest) {
        const process = await this.getProcessByInfo(processInfo);
        this.logger.log(`Adding new instant job for process: ${process.name}`);

        const instantProcess: InstantProcess = {
            process,
            ...rest,
        };
        const job = await this.processQueue.add(
            instantProcess,
            {
                jobId: `${process.name}:${process.id}:${uuidv4()}`,
                removeOnComplete: true,
                removeOnFail: true,
            }
        )
            .catch(err => {
                this.logger.error(`Failed to add new instant job for process: ${process.name}`, err);
                return Promise.reject(err);
            });

        return await job.finished() as StartProcessResponse;
    }

    async initializeQueue(processes: ScheduledProcess[]) {
        this.logger.log('Initializing queue');
        await this.clearQueue();
        await Promise.all(processes
            .map(process => this.addNewScheduledJob(process)));
        this.logger.log('Queue successfully initialized');
    }

    async clearQueue() {
        this.logger.log('Clearing queue');
        const jobsKeys = (await this.processQueue.getRepeatableJobs()).map(job => job.key);
        jobsKeys.forEach(key => this.processQueue.removeRepeatableByKey(key));
        await this.processQueue.empty()
            .then(() => this.logger.log('Queue cleared'))
            .catch(err => this.logger.error('Failed to clear the queue', err));
    }

    async addProcessToScheduledJobs(scheduledJobs: JobInformation[]) {
        return Promise.all(scheduledJobs.map(async (scheduledJob) => {
            const processData = scheduledJob.key.split(':');
            const processId = processData[3];
            const process = await this.processService.findById(Number(processId));
            return {
                ...scheduledJob,
                process
            };
        }));
    }

    async getJobById(id: number | string) {
        const job = await this.processQueue.getJob(id);
        const process = await this.processService.findById(Number(job.data.process.id));
        job.data.process = {...process};
        return job;
    }

    async getScheduledJobs() {
        this.logger.log('Getting scheduled jobs');
        const scheduledJobs = await this.processQueue.getRepeatableJobs();
        const extendedScheduledJobs = await this.addProcessToScheduledJobs(scheduledJobs);

        this.logger.log(`Successfully got ${extendedScheduledJobs.length} scheduled job(s)`);
        return extendedScheduledJobs;
    }

    async deleteScheduledJob(id: number) {
        this.logger.log(`Deleting scheduled job with id: ${id}`);
        const jobToRemove = await this.processQueue.getRepeatableJobs()
            .then(jobs => jobs.find(job => job.id === id.toString()));
        if (!jobToRemove) {
            this.logger.warn(`No job with id: ${id} found`);
            return;
        }
        const job = await this.findJobToDelete(id.toString());

        await job?.remove();
        await this.processQueue.removeRepeatableByKey(jobToRemove.key);
        this.uiGateway.server.emit(WsMessage.REMOVE_SCHEDULE_PROCESS, jobToRemove);
        this.logger.log(`Scheduled job with id: ${id} successfully deleted`);
    }

    async deleteJobFromQueue(id: string) {
        this.logger.log(`Deleting waiting job with id: ${id}`);
        const job = await this.processQueue.getJob(id);

        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);
        await job?.moveToCompleted();
        this.logger.log(`Job with id: ${id} successfully deleted`);
    }

    async findJobToDelete(id: string) {
        return this.processQueue.getJobs(['delayed', 'waiting', 'active']).then(jobs => jobs.find(job => job.data.id === id));
    }

    async getJobs() {
        this.logger.log('Getting jobs');
        const jobs = await this.processQueue.getJobs(QUEUE_JOB_STATUSES);
        const jobsWithProcesses = await this.updateProcessForScheduledJob(jobs);
        this.logger.log(`Successfully got ${jobs.length} job(s)`);
        return jobsWithProcesses;
    }

    async updateProcessForScheduledJob(jobs: Job[]) {
        return Promise.all(jobs.map(async (job) => {
            const process = await this.processService.findById(Number(job.data.process.id));
            job.data.process = {...process};
            return job;
        }));
    }

    async getWaitingJobs() {
        this.logger.log('Getting waiting jobs');
        const waitingJobs = await this.processQueue.getJobs(['waiting']);
        const activeJobs = await this.processQueue.getJobs(['active']);
        const waitingJobsWithProcesses = await this.updateProcessForScheduledJob(waitingJobs);
        const activeJobsWithProcesses = await this.updateProcessForScheduledJob(activeJobs);
        const newActive = activeJobsWithProcesses.map((job) => {
            job.data = {...job.data, isActive: true};
            return job;
        });
        const jobs = [...waitingJobsWithProcesses, ...newActive];


        this.logger.log(`Successfully got ${jobs.length} waiting job(s)`);
        return jobs;
    }

    private async deleteScheduledProcessIfExists(scheduledProcess: IScheduleProcess) {
        const { id, process } = scheduledProcess;
        const scheduledJobs = await this.getScheduledJobs();
        const jobToRemove = scheduledJobs.find(job => job.id === id.toString());
        const job = await this.findJobToDelete(jobToRemove?.id);
        if (!jobToRemove) return;

        this.uiGateway.server.emit(WsMessage.REMOVE_SCHEDULE_PROCESS, jobToRemove);

        await job?.remove();
        await this.processQueue.removeRepeatableByKey(jobToRemove.key);
        this.logger.log(`Removed previous scheduled job of process ${process.name}`);
    }

    async getProcessByInfo(processInfo: string | number) {
        const process = isNaN(Number(processInfo))
            ? await this.processService.findByName(processInfo as string)
            : await this.processService.findById(Number(processInfo));

        if (!process) {
            this.logger.error(`Process ${processInfo} does not exist`);
            throw new NotFoundException(`Process (${processInfo}) does not exist`);
        }

        return process;
    }
}