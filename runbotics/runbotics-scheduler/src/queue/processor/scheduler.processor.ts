import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueError,
    OnQueueFailed,
    OnQueueRemoved,
    OnQueueWaiting,
    Process,
    Processor,
} from '@nestjs/bull';
import { Logger } from '#/utils/logger';
import { SECOND, sleep } from '#/utils/time';
import { isScheduledProcess, Job, MAX_RETRY_BOT_AVAILABILITY } from '#/utils/process';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { BotStatus, IBot, IBotCollection, IBotSystem, IProcess, QueueEventType, WsMessage } from 'runbotics-common';
import { ProcessSchedulerService } from '../process/process-scheduler.service';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import { ProcessInstanceSchedulerService } from '../process-instance/process-instance.scheduler.service';
import { BotWebSocketGateway } from '#/websocket/bot/bot.gateway';
import { QueueService } from '#/queue/queue.service';
import { BadRequestException } from '@nestjs/common';
import { QueueMessageService } from '../queue-message.service';
import { JobId } from 'bull';
import { BlacklistActionAuthService } from '#/blacklist-actions-auth/blacklist-action-auth.service';

@Processor('scheduler')
export class SchedulerProcessor {
    private readonly logger = new Logger(SchedulerProcessor.name);

    constructor(
        private readonly processSchedulerService: ProcessSchedulerService,
        private readonly botService: BotService,
        private readonly processService: ProcessService,
        private readonly uiGateway: UiGateway,
        private readonly botGateway: BotWebSocketGateway,
        private readonly processInstanceSchedulerService: ProcessInstanceSchedulerService,
        private readonly queueService: QueueService,
        private readonly queueMessageService: QueueMessageService,
        private readonly blacklistActionAuthService: BlacklistActionAuthService,
    ) {
    }

    @Process({ concurrency: 1 })
    async process(job: Job) {
        if (!job.data) {
            throw new Error('Job data is empty');
        }
        await this.validateTriggerData(job)
            .catch((err) => Promise.reject(new Error(err)));

        const process = await this.processService.findById(job.data.process.id);

        //reverse value of check, because it returns if the process is blacklisted, so is allowed when is not blacklisted
        const isAllowedToRun = !(await this.blacklistActionAuthService.checkProcessActionsBlacklist(process.id ?? job.data.process.id));

        if(!isAllowedToRun) {
            this.logger.error(`[Q Process] Process "${process.name}" contains blacklisted actions and cannot be run.`);
            await this.processInstanceSchedulerService.saveFailedProcessInstance(
                job,
                'Process contains blacklisted actions',
            );
            throw new BadRequestException(`Process ${process.id} contains blacklisted actions and cannot be run.`);
        }
        if (!isScheduledProcess(job.data)) {
            return this.runProcess(process, job);
        }
        const result = await this.queueService.handleAttendedProcess(process, job.data.input)
            .then(() => this.runProcess(process, job))
            .catch((err) => {
                this.logger.error(`[Q Process] Process "${process.name}" has scheduled without input variables. ${err.message}`);
                throw new BadRequestException(err);
            });
        return result;
    }

    @OnQueueActive()
    async onActive(job: Job) {
        this.logger.log(`[Q Active] Job ${job.id} is active`);

        const process = await this.processService.findById(
            Number(job.data.process.id),
        );
        const tenantRoom = process.tenantId;
        const jobWithProcessAndActive = job;
        jobWithProcessAndActive.data = { ...job.data, isActive: true, process };
        this.uiGateway.emitTenant(
            tenantRoom,
            WsMessage.ADD_WAITING_SCHEDULE,
            jobWithProcessAndActive,
        );

        const active = await this.queueService.getActiveJobs();
        const waiting = await this.queueService.getWaitingJobs();
        const jobs = [...active, ...waiting];

        await Promise.all(jobs.map((job, jobIndex) => {
            const queuePosition = jobIndex + 1;
            const processId = job.data.process.id;
            const jobId = job.id;
            const orchestratorProcessInstanceId = job.data.orchestratorProcessInstanceId;
            const clientId = job.data.input.clientId;

            if (queuePosition === 1) {
                this.uiGateway.emitClient(
                    clientId,
                    WsMessage.JOB_ACTIVE,
                    {
                        processId,
                        jobId,
                        orchestratorProcessInstanceId,
                    },
                );
                return this.queueMessageService.sendQueueMessage(QueueEventType.ACTIVE, job);
            }
            this.uiGateway.emitClient(
                clientId,
                WsMessage.JOB_WAITING,
                { processId, queuePosition, jobId },
            );
            return this.queueMessageService.sendQueueMessage(QueueEventType.UPDATE, job, queuePosition);
        }));
    }

    @OnQueueWaiting()
    async onWaiting(jobId: JobId) {
        this.logger.log(`[Q Waiting] Job ${jobId} is waiting`);

        const active = await this.queueService.getActiveJobs();
        const waiting = await this.queueService.getWaitingJobs();
        const jobs = [...active, ...waiting];

        const jobIndex = jobs.findIndex((job) => job.id === jobId);
        const job = jobs[jobIndex];
        if (!job) return;

        const queuePosition = jobIndex + 1;
        const processId = job.data.process.id;
        const tenantRoom = job.data.process.tenantId;
        const orchestratorProcessInstanceId = job?.data?.orchestratorProcessInstanceId;
        const clientId = job.data.input.clientId;

        this.uiGateway.emitTenant(tenantRoom, WsMessage.ADD_WAITING_SCHEDULE, job);
        this.uiGateway.emitClient(
            clientId,
            WsMessage.JOB_WAITING,
            {
                processId,
                queuePosition,
                jobId,
                orchestratorProcessInstanceId,
            },
        );
        await this.queueMessageService.sendQueueMessage(QueueEventType.UPDATE, job, queuePosition);
    }

    @OnQueueCompleted()
    onComplete(job: Job) {
        this.logger.log(`[Q Completed] Job ${job.id} is completed`);

        this.queueService.clearQueueTimer(job.id);

        const processId = job.data.process.id;
        const tenantRoom = job.data.process.tenantId;
        const clientId = job.data.input.clientId;
        this.uiGateway.emitTenant(tenantRoom, WsMessage.REMOVE_WAITING_SCHEDULE, job);
        this.uiGateway.emitClient(clientId, WsMessage.PROCESS_STARTED, { processId });
    }

    @OnQueueFailed()
    async onFailed(job: Job, error: Error) {
        this.logger.error(
            `[Q Fail] Job "${job.data.process.name}" failed`,
            error,
        );

        this.queueService.clearQueueTimer(job.id);

        const processId = job.data.process.id;
        const tenantRoom = job.data.process.tenantId;
        const clientId = job.data.input.clientId;
        const errorMessage = error.message;
        this.uiGateway.emitTenant(tenantRoom, WsMessage.REMOVE_WAITING_SCHEDULE, job);
        this.uiGateway.emitClient(clientId, WsMessage.JOB_FAILED, { processId, errorMessage });
        await this.queueMessageService.sendQueueMessage(QueueEventType.FAILED, job);
    }

    @OnQueueRemoved()
    async onRemove(job: Job) {
        this.logger.log(`[Q Removed] Job ${job.id} is removed from queue`);

        this.queueService.clearQueueTimer(job.id);

        const tenantRoom = job.data.process.tenantId;
        this.uiGateway.emitTenant(tenantRoom, WsMessage.REMOVE_WAITING_SCHEDULE, job);

        await this.queueMessageService.sendQueueMessage(QueueEventType.REMOVE, job);

        const active = await this.queueService.getActiveJobs();
        const waiting = await this.queueService.getWaitingJobs();
        const jobs = [...active, ...waiting];

        await Promise.all(jobs.map((job, jobIndex) => {
            const queuePosition = jobIndex + 1;
            const processId = job.data.process.id;
            const clientId = job.data.input.clientId;
            const jobId = job.id;
            if (queuePosition === 1) return;

            this.uiGateway.emitClient(clientId, WsMessage.JOB_WAITING, { processId, queuePosition, jobId });
            return this.queueMessageService.sendQueueMessage(QueueEventType.UPDATE, job, queuePosition);
        }));
    }

    @OnQueueError({ name: 'scheduler' })
    async onError(job: Job, err: Error) {
        if (job.data) {
            this.logger.error(
                `[Q Error] Job '${job.data.process.name}' crashed`,
                err,
            );
        }

        this.queueService.clearQueueTimer(job.id);
    }

    private isAnyBotConnected = (availableBots: IBot[]): boolean =>
        availableBots.length !== 0;

    private findConnectedBot = (bots: IBot[]) =>
        bots.find((bot) => bot.status === BotStatus.CONNECTED);

    private async checkBotAvailability(
        collection: IBotCollection,
        system: IBotSystem,
        job: Job,
    ): Promise<IBot> {
        let retry = MAX_RETRY_BOT_AVAILABILITY;
        while (--retry) {
            const availableBots: IBot[] =
                await this.botService.findAvailableCollection(
                    collection,
                    system,
                );

            const availableBot = this.findConnectedBot(availableBots);

            if (availableBot) {
                this.logger.log(
                    `[Q Process] Bot ${availableBot.id} is available`,
                );
                return Promise.resolve(availableBot);
            }

            if (!this.isAnyBotConnected(availableBots)) {
                const errorMessage = 'All bots are disconnected';
                await this.processInstanceSchedulerService.saveFailedProcessInstance(
                    job,
                    errorMessage,
                );

                return Promise.reject(errorMessage);
            }

            const errorMessage = 'All bots are busy';
            this.logger.warn(
                `[Q Process] ${errorMessage}, waiting... (${
                    MAX_RETRY_BOT_AVAILABILITY - retry
                }/${MAX_RETRY_BOT_AVAILABILITY})`,
            );

            await sleep(SECOND);
        }

        const errorMessage = 'Timeout: all bots are busy';
        await this.processInstanceSchedulerService.saveFailedProcessInstance(
            job,
            errorMessage,
        );
        return Promise.reject(errorMessage);
    }

    private async runProcess(process: IProcess, job: Job) {
        this.logger.log(
            `[Q Process] Starting process "${process.name}" | JobID: `,
            job.id,
        );

        const bot = await this.checkBotAvailability(
            process.botCollection,
            process.system,
            job,
        ).catch((err) => Promise.reject(new Error(err)));

        this.logger.log(`Starting process ${process.name} on bot ${bot.id}`);

        const orchestratorProcessInstanceId = job.data.orchestratorProcessInstanceId;
        await this.processSchedulerService.startProcess(job.data, bot, orchestratorProcessInstanceId);

        await this.botGateway.setBotStatusBusy(bot);

        this.logger.log(
            `[Q Process] Process "${process.name}" freed the queue | JobID: `,
            job.id,
        );
        return orchestratorProcessInstanceId;
    }

    private async validateTriggerData(job: Job) {
        if (!Object.keys(job.data.triggerData).length) {
            await this.processInstanceSchedulerService.saveFailedProcessInstance(
                job,
                'User email not specified',
            );
            return Promise.reject();
        }
    }
}
