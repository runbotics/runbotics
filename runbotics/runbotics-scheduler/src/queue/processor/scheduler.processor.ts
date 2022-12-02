import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueError,
    OnQueueFailed,
    OnQueueWaiting,
    Process,
    Processor,
} from '@nestjs/bull';
import { Logger } from 'src/utils/logger';
import { SECOND, sleep } from 'src/utils/time';
import {
    Job,
    MAX_RETRY_BOT_AVAILABILITY,
} from 'src/utils/process';
import { BotService } from 'src/database/bot/bot.service';
import {
    BotStatus,
    IBot,
    IBotCollection,
    IBotSystem,
    WsMessage,
} from 'runbotics-common';
import { ProcessSchedulerService } from '../process/process.scheduler.service';
import { ProcessService } from 'src/database/process/process.service';
import { UiGateway } from '../../websocket/gateway/ui.gateway';
import { ProcessInstanceSchedulerService } from '../process-instance/process-instance.scheduler.service';
import { SchedulerService } from '../scheduler/scheduler.service';

@Processor('scheduler')
export class SchedulerProcessor {
    private readonly logger = new Logger(SchedulerProcessor.name);

    constructor(
        private readonly processSchedulerService: ProcessSchedulerService,
        private readonly botService: BotService,
        private readonly processService: ProcessService,
        private readonly uiGateway: UiGateway,
        private readonly processInstanceSchedulerService: ProcessInstanceSchedulerService,
        private readonly schedulerService: SchedulerService,
    ) {}

    private isEveryBotDisconnected = (availableBots: IBot[]) =>
        availableBots.length === 0 ||
        availableBots.every((bot) => bot.status === BotStatus.DISCONNECTED);

    private async checkBotAvailability(
        collection: IBotCollection,
        system: IBotSystem,
        job: Job
    ) {
        let retry = MAX_RETRY_BOT_AVAILABILITY;
        while (--retry) {
            const availableBots = await this.botService.findByCollectionAndSystem(
                collection,
                system
            );
            const availableBot = availableBots?.find(
                (bot) => bot.status === BotStatus.CONNECTED
            );

            if (availableBot) {
                const busyBot = await this.botService.setBusy(availableBot);
                this.uiGateway.server.emit(WsMessage.BOT_STATUS, busyBot);
                this.logger.log(`[Q Process] Bot ${availableBot.id} is available`);
                return Promise.resolve(availableBot);
            }

            if (this.isEveryBotDisconnected(availableBots)) {
                const errorMessage = 'All bots are disconnected';
                await this.processInstanceSchedulerService.saveFailedProcessInstance(job, errorMessage);
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
        await this.processInstanceSchedulerService.saveFailedProcessInstance(job, errorMessage);
        return Promise.reject(errorMessage);
    }

    @Process({ concurrency: 1 })
    async process(job: Job) {
        if (!job.data) {
            throw new Error('Job data is empty');
        }

        const process = await this.processService.findById(job.data.process.id);
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

        this.logger.log(
            `[Q Process] Process "${process.name}" freed the queue | JobID: `,
            job.id
        );

        return this.processSchedulerService.startProcess(job.data, bot);
    }

    @OnQueueActive()
    async onActive(job: Job) {
        const process = await this.processService.findById(Number(job.data.process.id));
        const jobWithProcessAndActive = job;
        jobWithProcessAndActive.data = {...job.data, isActive: true, process};
        this.uiGateway.server.emit(WsMessage.ADD_WAITING_SCHEDULE, jobWithProcessAndActive);
    }

    @OnQueueWaiting()
    async onWaiting(jobId: Job['id']) {
        this.schedulerService.getJobById(jobId)
            .then((job) =>{
                this.uiGateway.server.emit(WsMessage.ADD_WAITING_SCHEDULE, job);
                this.logger.log(`[Q Waiting] Job ${jobId} is waiting`);
            });
    }

    @OnQueueCompleted()
    onComplete(job: Job) {
        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);
    }

    @OnQueueFailed()
    onFailed(job: Job, err: Error) {
        this.uiGateway.server.emit(WsMessage.REMOVE_WAITING_SCHEDULE, job);
        this.logger.error(`[Q Fail] Job "${job.data.process.name}" failed`, err);
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
}