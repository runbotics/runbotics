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
import { BotStatus, IBot, IBotCollection, IBotSystem, IProcess, WsMessage, ProcessQueueMessage } from 'runbotics-common';
import { ProcessSchedulerService } from '../process/process-scheduler.service';
import { ProcessService } from '#/database/process/process.service';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import { ProcessInstanceSchedulerService } from '../process-instance/process-instance.scheduler.service';
import { SchedulerService } from '../scheduler/scheduler.service';
import { BotWebSocketGateway } from '#/websocket/bot/bot.gateway';
import { QueueService } from '#/queue/queue.service';
import { BadRequestException } from '@nestjs/common';
import { MessagingService } from '../messaging/messaging.service';

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
        private readonly messagingService: MessagingService,
        private readonly queueService: QueueService
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
        const process = await this.processService.findById(
            Number(job.data.process.id)
        );
        const jobWithProcessAndActive = job;
        jobWithProcessAndActive.data = { ...job.data, isActive: true, process };
        this.uiGateway.server.emit(
            WsMessage.ADD_WAITING_SCHEDULE,
            jobWithProcessAndActive
        );
        this.logger.log(`[Q Active] Job ${job.id} is active`);
        job.data.input?.timeout && this.queueService.clearQueueTimer(job.id);
    }

    @OnQueueWaiting()
    async onWaiting(jobId: Job['id']) {
        this.schedulerService.getJobById(jobId).then((job) => {
            this.uiGateway.server.emit(WsMessage.ADD_WAITING_SCHEDULE, job);
            this.logger.log(`[Q Waiting] Job ${jobId} is waiting`);
        });
    }

    @OnQueueRemoved()
    onRemove(job: Job) {
        this.logger.log(`[Q Removed] Job ${job.id} is removed from queue`);
        this.messagingService.emitProcessQueueUpdate(job.id);
        const removedPayload: ProcessQueueMessage[WsMessage.PROCESS_REMOVED] = {
            jobId: job.id,
            processId: job.data.process?.id,
        };
        this.messagingService.sendSpecificJobMessage(WsMessage.PROCESS_REMOVED, removedPayload, job.data.clientId, job.data.input?.callbackUrl);
    }

    @OnQueueCompleted()
    onComplete(job: Job) {
        this.logger.log(`[Q Completed] Job ${job.id} is completed`);
        this.messagingService.emitProcessQueueUpdate(job.id);
        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);
    }

    @OnQueueFailed()
    onFailed(job: Job, err: Error) {
        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);
        this.messagingService.emitProcessQueueUpdate(job.id);
        const failedPayload: ProcessQueueMessage[WsMessage.PROCESS_FAILED] = {
            jobId: job.id,
            processId: job.data.process?.id,
            message: err.message,
        };
        this.messagingService.sendSpecificJobMessage(WsMessage.PROCESS_FAILED, failedPayload, job.data.clientId, job.data.input?.callbackUrl);
        this.logger.error(
            `[Q Fail] Job "${job.data.process.name}" failed`,
            err
        );
    }

    @OnQueueError({ name: 'scheduler' })
    async onError(job: Job, err: Error) {
        if (job.data) {
            this.logger.error(
                `[Q Error] Job '${job.data.process.name}' crashed`,
                err
            );
        }
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
        const processingPayload: ProcessQueueMessage[WsMessage.PROCESS_PROCESSING] = {
            jobId: job.id,
            processId: job.data.process?.id,
        };
        this.messagingService.sendSpecificJobMessage(WsMessage.PROCESS_PROCESSING, processingPayload, job.data.clientId, job.data.input?.callbackUrl);
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

        const completedPayload: ProcessQueueMessage[WsMessage.PROCESS_COMPLETED] = {
            jobId: job.id,
            processId: job.data.process?.id,
            orchestratorProcessInstanceId,
        };
        this.messagingService.sendSpecificJobMessage(WsMessage.PROCESS_COMPLETED, completedPayload, job.data.clientId, job.data.input?.callbackUrl);

        return { orchestratorProcessInstanceId };
    }
}
