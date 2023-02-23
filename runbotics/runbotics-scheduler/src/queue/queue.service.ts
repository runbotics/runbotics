import { BotSchedulerService } from './bot/bot.scheduler.service';
import { ProcessService } from '../database/process/process.service';
import { InjectQueue } from '@nestjs/bull';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { Job, Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { ValidateProcessAccessProps } from 'src/types/scheduled-process';
import { Logger } from 'src/utils/logger';
import { StartProcessRequest, StartProcessResponse } from 'src/types';
import { ScheduleProcessService } from 'src/database/schedule-process/schedule-process.service';
import {
    IProcess, WsMessage, ScheduledProcess, InstantProcess, ProcessInput, TriggerEvent,
} from 'runbotics-common';
import { UiGateway } from '../websocket/gateway/ui.gateway';
import getVariablesFromSchema, { isObject } from 'src/utils/variablesFromSchema';
import difference from 'lodash/difference';
import { ServerConfigService } from 'src/config/server-config/server-config.service';

@Injectable()
export class QueueService implements OnModuleInit {
    private readonly logger = new Logger(QueueService.name);

    constructor(
        @InjectQueue('scheduler') private readonly processQueue: Queue,
        private readonly processService: ProcessService,
        private readonly scheduleProcessService: ScheduleProcessService,
        private readonly botSchedulerService: BotSchedulerService,
        private readonly uiGateway: UiGateway,
        private readonly serverConfigService: ServerConfigService,
    ) {}

    async onModuleInit() {
        await this.initializeQueue();
        await this.botSchedulerService.initializeBotsStatuses();
    }

    async createScheduledJob(scheduledProcess: ScheduledProcess) {
        this.logger.log(`Adding new scheduled job for process: ${scheduledProcess.process.name}`);

        await this.processQueue.add(scheduledProcess, {
            repeat: {
                cron: scheduledProcess.cron,
                tz: this.serverConfigService.timezone,
            },
            jobId: `${scheduledProcess.id}:${scheduledProcess.process.id}`,
            removeOnComplete: true,
            removeOnFail: true,
        })
            .then(() => {
                this.uiGateway.server.emit(WsMessage.ADD_SCHEDULE_PROCESS, scheduledProcess);
                this.logger.log(`Process: "${scheduledProcess.process.name}":${scheduledProcess.process.id} successfully scheduled | scheduleID: ${scheduledProcess.id}`);
            })
            .catch(err => this.logger
                .error(`Failed to add new scheduled job for process: ${scheduledProcess.process.name}`, err));
    }

    async createInstantJob(params: StartProcessRequest) {
        const { process, input } = params;
        this.logger.log(`Adding new instant job for process: ${process.name}`);

        await this.handleAttendedProcess(process, input)
            .catch(err => {
                throw new BadRequestException(err);
            });

        const instantProcess: InstantProcess = params;

        const job = await this.processQueue
            .add(instantProcess, {
                jobId: `${process.id}:${uuidv4()}`,
                removeOnComplete: true,
                removeOnFail: true,
            })
            .catch((err) => {
                this.logger.error(
                    `Failed to add new instant job for process "${process.name}"`,
                    err
                );
                return Promise.reject(err);
            });

        return job.finished() as Promise<StartProcessResponse>;
    }

    async deleteJobFromQueue(id: string) {
        this.logger.log(`Deleting waiting job with id: ${id}`);
        const job = await this.processQueue.getJob(id);

        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);
        await job?.moveToCompleted();
        this.logger.log(`Job with id: ${id} successfully deleted`);
    }

    async deleteQueueJobsBySchedule(id: string) {
        const jobs = await this.processQueue.getJobs(['delayed', 'waiting', 'active', 'paused'])
            .then(jobs => jobs.filter(job => job.data.id === id));
        
        await Promise.all(jobs.map(job => job.remove()));
    }

    async updateProcessForScheduledJob(jobs: Job[]) {
        return Promise.all(jobs.map(async (job) => {
            const process = await this.processService.findById(Number(job.data.process.id));
            job.data.process = { ...process };
            return job;
        }));
    }

    async getProcessByInfo(processInfo: string | number) {
        const process = this.processService.findByInfo(processInfo);

        if (!process) {
            this.logger.error(`Process ${processInfo} does not exist`);
            throw new NotFoundException(`Process (${processInfo}) does not exist`);
        }

        return process;
    }

    async validateProcessAccess({ process, user, triggered = false }: ValidateProcessAccessProps) {
        const hasAccess = (process.createdBy.id === user?.id);
        const isPublic = process.isPublic;
        const isTriggerable = process?.isTriggerable;
        const isAdmin = user?.authorities.filter(role => role.name === 'ROLE_ADMIN').length > 0;

        if (!hasAccess && !isPublic && !isAdmin) {
            this.logger.error(`User${user ? ' ' + user?.login : ''} does not have access to the process "${process?.id}"`);
            throw new ForbiddenException(`You do not have access to the process "${process?.id}"`);
        }

        if (triggered && !isTriggerable) {
            this.logger.error(`Process "${process?.id}" is not triggerable`);
            throw new ForbiddenException(`Process "${process?.id}" is not triggerable`);
        }
    }

    private async initializeQueue() {
        this.logger.log('Initializing queue');
        await this.clearStaledSchedules();
        this.logger.log('Creating schedules');
        const scheduledProcesses = await this.scheduleProcessService.findAll();
        await Promise.all(
            scheduledProcesses
                .map(process => this.createScheduledJob({ ...process, trigger: { name: TriggerEvent.SCHEDULER } }))
        );
        this.logger.log(`Created ${scheduledProcesses.length} schedule(s)`);
        this.logger.log('Queue successfully initialized');
    }

    private async clearStaledSchedules() {
        this.logger.log('Clearing staled jobs');
        
        const repeatableJobs = await this.processQueue.getRepeatableJobs();
        
        await Promise.all(repeatableJobs
            .map((job) => job.key)
            .map((key) => this.processQueue.removeRepeatableByKey(key))
        );

        await this.deleteAllJobs();

        this.logger.log('Cleared staled job(s)');
    }
    
    private async handleAttendedProcess(process: IProcess, input?: ProcessInput) {
        if (!process.isAttended) return;
        
        if (!input?.variables) {
            const err = 'You haven\'t provided variables for attended process';
            this.logger.error(`Failed to add new instant job for process "${process.name}". ${err}`);
            throw new BadRequestException(err);
        }

        const passedVariables = input.variables;
        const requiredVariables = getVariablesFromSchema(JSON.parse(process.executionInfo).schema, true);
        const missingVariables = difference(requiredVariables, Object.keys(passedVariables));
        if (missingVariables.length > 0) {
            const err = `You haven't provided variables for attended process: ${missingVariables.join(', ')}`;
            this.logger.error(`Failed to add new instant job for process "${process.name}". ${err}`);
            throw new BadRequestException(err);
        }

        const emptyVariables = requiredVariables
            .map((variable) => isObject(passedVariables[variable]) || passedVariables[variable] !== ''
                ? null
                : variable)
            .filter((variable) => variable !== null);

        if (emptyVariables.length > 0) {
            const err = `You haven't provided variables for attended process: ${emptyVariables.join(', ')}`;
            this.logger.error(`Failed to add new instant job for process "${process.name}". ${err}`);
            throw new BadRequestException(err);
        }
    }

    async deleteScheduledJob(id: number) {
        this.logger.log(`Deleting scheduled job with id: ${id}`);

        const scheduledJob = await this.processQueue.getRepeatableJobs()
            .then(jobs => jobs.find(job => job.id === id.toString()));
        if (!scheduledJob) {
            this.logger.warn(`No job with id: ${id} found`);
            return;
        }
    
        await this.deleteQueueJobsBySchedule(id.toString());

        await this.processQueue.removeRepeatableByKey(scheduledJob.key);
        this.uiGateway.server.emit(WsMessage.REMOVE_SCHEDULE_PROCESS, scheduledJob);
        this.logger.log(`Scheduled job with id: ${id} successfully deleted`);
    }

    private async deleteAllJobs() {
        const jobs = await this.processQueue.getJobs(['active', 'delayed','paused', 'waiting']);
        await Promise.all(jobs.map(job => job.remove()));
    }

}