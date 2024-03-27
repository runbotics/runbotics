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
import { BotService } from '#/database/bot/bot.service';
import { BotStatus, IBot, IBotCollection, IBotSystem, IProcess, StartProcessResponse, WsMessage } from 'runbotics-common';
import { ProcessSchedulerService } from '../process/process-scheduler.service';
import { ProcessService } from '#/database/process/process.service';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import { ProcessInstanceSchedulerService } from '../process-instance/process-instance.scheduler.service';
import { SchedulerService } from '../scheduler/scheduler.service';
import { BotWebSocketGateway } from '#/websocket/bot/bot.gateway';
import { QueueService } from '#/queue/queue.service';
import { BadRequestException } from '@nestjs/common';
import { QueueMessageService } from '../queue-message.service';
import { JobId } from 'bull';

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
        private readonly schedulerService: SchedulerService,
        private readonly queueService: QueueService,
        private readonly queueMessageService: QueueMessageService
    ) {}

    @Process({ concurrency: 1 })
    async process(job: Job) {
        if (!job.data) {
            throw new Error('Job data is empty');
        }

        const process = await this.processService.findById(job.data.process.id);
        if (!isScheduledProcess(job.data)) {
            return this.runProcess(process, job);
        }
        return await this.queueService.handleAttendedProcess(process, job.data.input)
            .then(() => this.runProcess(process, job))
            .catch((err) => {
                this.logger.error(`[Q Process] Process "${process.name}" has scheduled without input variables. ${err.message}`);
                throw new BadRequestException(err);
            });
    }

    @OnQueueActive()
    async onActive(job: Job) {
        this.logger.log(`[Q Active] Job ${job.id} is active`);

        const process = await this.processService.findById(
            Number(job.data.process.id)
        );
        const jobWithProcessAndActive = job;
        jobWithProcessAndActive.data = { ...job.data, isActive: true, process };
        this.uiGateway.server.emit(
            WsMessage.ADD_WAITING_SCHEDULE,
            jobWithProcessAndActive
        );

        const active = await this.queueService.getActiveJobs();
        const waiting = await this.queueService.getWaitingJobs();
        const jobs = [...active, ...waiting];

        await Promise.all(jobs.map((job, jobIndex) => {
            const queuePosition = jobIndex + 1;
            if (queuePosition === 1) {
                return this.queueMessageService.sendQueueMessage('ACTIVE', job);
            }
            return this.queueMessageService.sendQueueMessage('UPDATE', job, queuePosition);
        }));
    }

    @OnQueueWaiting()
    async onWaiting(jobId: JobId) {
        this.logger.log(`[Q Waiting] Job ${jobId} is waiting`);

        const active = await this.queueService.getActiveJobs();
        const waiting = await this.queueService.getWaitingJobs();
        const jobs = [...active, ...waiting];

        const jobIndex = jobs.findIndex((job) => job.id === jobId);
        const queuePosition = jobIndex + 1;
        const job = jobs[jobIndex];

        if (job) {
            this.uiGateway.server.emit(WsMessage.ADD_WAITING_SCHEDULE, job);

            await this.queueMessageService.sendQueueMessage('UPDATE', job, queuePosition);
        }
    }

    @OnQueueCompleted()
    onComplete(job: Job, orchestratorProcessInstanceId: StartProcessResponse['orchestratorProcessInstanceId']) {
        this.logger.log(`[Q Completed] Job ${job.id} is completed`);

        this.queueService.clearQueueTimer(job.id);

        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);

        const user = job?.data?.user;
        if (user?.id) {
            this.uiGateway.emitByUserId<WsMessage.PROCESS_COMPLETED>(
                user.id,
                WsMessage.PROCESS_COMPLETED,
                {
                    processId: job?.data?.process?.id,
                    orchestratorProcessInstanceId,
                }
            );
        }
    }

    @OnQueueFailed()
    async onFailed(job: Job, error: Error) {
        this.logger.error(
            `[Q Fail] Job "${job.data.process.name}" failed`,
            error
        );

        this.queueService.clearQueueTimer(job.id);

        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);

        await this.queueMessageService.sendQueueMessage('FAILED', job);

        const user = job?.data?.user;
        if (user?.id) {
            this.uiGateway.emitByUserId<WsMessage.PROCESS_FAILED>(
                user.id,
                WsMessage.PROCESS_FAILED,
                {
                    processId: job?.data?.process?.id,
                    error: error.message
                }
            );
        }
    }

    @OnQueueRemoved()
    async onRemove(job: Job) {
        this.logger.log(`[Q Removed] Job ${job.id} is removed from queue`);

        this.queueService.clearQueueTimer(job.id);

        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);

        await this.queueMessageService.sendQueueMessage('REMOVE', job);
    }

    @OnQueueError({ name: 'scheduler' })
    async onError(job: Job, err: Error) {
        if (job.data) {
            this.logger.error(
                `[Q Error] Job '${job.data.process.name}' crashed`,
                err
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
        job: Job
    ): Promise<IBot> {
        let retry = MAX_RETRY_BOT_AVAILABILITY;
        while (--retry) {
            const availableBots: IBot[] =
                await this.botService.findAvailableCollection(
                    collection,
                    system
                );

            const availableBot = this.findConnectedBot(availableBots);

            if (availableBot) {
                this.logger.log(
                    `[Q Process] Bot ${availableBot.id} is available`
                );
                return Promise.resolve(availableBot);
            }

            if (!this.isAnyBotConnected(availableBots)) {
                const errorMessage = 'All bots are disconnected';
                await this.processInstanceSchedulerService.saveFailedProcessInstance(
                    job,
                    errorMessage
                );

                return Promise.reject(errorMessage);
            }

            const errorMessage = 'All bots are busy';
            this.logger.warn(
                `[Q Process] ${errorMessage}, waiting... (${
                    MAX_RETRY_BOT_AVAILABILITY - retry
                }/${MAX_RETRY_BOT_AVAILABILITY})`
            );

            await sleep(SECOND);
        }

        const errorMessage = 'Timeout: all bots are busy';
        await this.processInstanceSchedulerService.saveFailedProcessInstance(
            job,
            errorMessage
        );
        return Promise.reject(errorMessage);
    }

    private async runProcess(process: IProcess, job: Job) {
        this.logger.log(
            `[Q Process] Starting process "${process.name}" | JobID: `,
            job.id
        );

        const bot = await this.checkBotAvailability(
            process.botCollection,
            process.system,
            job
        ).catch((err) => Promise.reject(new Error(err)));

        this.logger.log(`Starting process ${process.name} on bot ${bot.id}`);

        const { orchestratorProcessInstanceId } =
            await this.processSchedulerService.startProcess(job.data, bot);

        await this.botGateway.setBotStatusBusy(bot);

        this.logger.log(
            `[Q Process] Process "${process.name}" freed the queue | JobID: `,
            job.id
        );

        return orchestratorProcessInstanceId;
    }
}
