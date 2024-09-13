import { Test } from '@nestjs/testing';
import { SchedulerProcessor } from './scheduler.processor';
import { BotService } from '#/database/bot/bot.service';
import { ProcessService } from '#/database/process/process.service';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import { BotWebSocketGateway } from '#/websocket/bot/bot.gateway';
import { ProcessInstanceSchedulerService } from '../process-instance/process-instance.scheduler.service';
import { QueueService } from '#/queue/queue.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BotEntity } from '#/database/bot/bot.entity';
import { expect, vi } from 'vitest';
import { ProcessEntity } from '#/database/process/process.entity';
import { getQueueToken } from '@nestjs/bull';
import {
    BotStatus,
    IBot,
    InstantProcess,
    IProcess,
    ProcessInput,
    ScheduledProcess,
    TriggerEvent, WsMessage,
} from 'runbotics-common';
import { Job } from '#/utils/process';
import { ProcessSchedulerService } from '#/queue/process/process-scheduler.service';
import { QueueMessageService } from '../queue-message.service';
import { ScheduleProcessService } from '#/scheduler-database/schedule-process/schedule-process.service';
import { BotSchedulerService } from '#/queue/bot/bot.scheduler.service';
import { ServerConfigService } from '#/config/server-config';
import { WsBotJwtGuard } from '#/auth/guards';
import { CanActivate } from '@nestjs/common';
import { SchedulerService } from '#/queue/scheduler/scheduler.service';

const PROCESS_ID = 2137;
const JOB_ID = 7312;
const ORCHESTRATOR_INSTANCE_ID = 'tEsT-InStAnCe-iD';

const mockForceActivateGuard: CanActivate = { canActivate: vi.fn(() => true) };

const PROCESS: IProcess = {
    id: PROCESS_ID,
};

const PROCESS_INPUT: ProcessInput = {
    variables: {
        stringTestVariable: 'stringTestVariable',
        numberTestVariable: 'numberTestVariable',
    },
};

const INSTANT_PROCESS: InstantProcess = {
    process: PROCESS,
    trigger: {
        name: TriggerEvent.MANUAL,
    },
    triggerData: { userEmail: 'test@test' },
    input: PROCESS_INPUT,
    orchestratorProcessInstanceId: ORCHESTRATOR_INSTANCE_ID,
};

const INSTANT_PROCESS_WITHOUT_USER: InstantProcess = {
    ...INSTANT_PROCESS, triggerData: {}
};

const SCHEDULED_PROCESS: ScheduledProcess = {
    ...INSTANT_PROCESS,
    trigger: {
        name: TriggerEvent.SCHEDULER,
    },
    id: 1232,
    cron: '* * * * *',
};

const JOB: Job = {
    data: INSTANT_PROCESS,
    id: JOB_ID,
} as Job;

const SCHEDULED_JOB: Job = {
    data: SCHEDULED_PROCESS,
    id: JOB_ID,
} as Job;

const JOB_WITHOUT_USER: Job = {
    data: INSTANT_PROCESS_WITHOUT_USER,
    id: JOB_ID
} as Job;

describe('SchedulerProcessor', () => {
    let schedulerProcessor: SchedulerProcessor;
    let processService: ProcessService;
    let botService: BotService;
    let processSchedulerService: ProcessSchedulerService;
    let uiGateway: UiGateway;
    let botWebSocketGateway: BotWebSocketGateway;
    let processInstanceSchedulerService: ProcessInstanceSchedulerService;
    let queueService: QueueService;
    let queueMessageService: QueueMessageService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ProcessSchedulerService,
                SchedulerProcessor,
                BotService,
                ProcessService,
                UiGateway,
                BotWebSocketGateway,
                ProcessInstanceSchedulerService,
                QueueService,
                QueueMessageService,
                BotSchedulerService,
                {
                    provide: ServerConfigService,
                    useValue: {},
                },
                {
                    provide: ScheduleProcessService,
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(BotEntity),
                    useValue: {
                        save: vi.fn().mockResolvedValue(null),
                        find: vi.fn().mockResolvedValue([null]),
                    },
                },
                {
                    provide: getRepositoryToken(ProcessEntity),
                    useValue: {
                        save: vi.fn().mockResolvedValue(null),
                        find: vi.fn().mockResolvedValue([null]),
                    },
                },
                {
                    provide: getQueueToken('scheduler'),
                    useValue: {},
                },
            ],
        })
            .overrideProvider(BotService)
            .useValue({
                findAvailableCollection: vi.fn().mockReturnValue([{ status: BotStatus.CONNECTED } as IBot]),
            })
            .overrideProvider(ProcessService)
            .useValue({
                findById: vi.fn().mockReturnValue(PROCESS),
            })
            .overrideProvider(ProcessSchedulerService)
            .useValue({
                startProcess: vi.fn().mockReturnValue({ orchestratorProcessInstanceId: ORCHESTRATOR_INSTANCE_ID }),
            })
            .overrideProvider(BotWebSocketGateway)
            .useValue({
                setBotStatusBusy: vi.fn(),
            })
            .overrideProvider(ProcessInstanceSchedulerService)
            .useValue({
                saveFailedProcessInstance: vi.fn(),
            })
            .overrideProvider(SchedulerService)
            .useValue({
                getJobById: vi.fn().mockResolvedValue(JOB),
            })
            .overrideProvider(UiGateway)
            .useValue({
                server: {
                    emit: vi.fn(),
                },
                emitAll: vi.fn(),
                emitClient: vi.fn(),
            })
            .overrideGuard(WsBotJwtGuard).useValue(mockForceActivateGuard)
            .compile();

        schedulerProcessor = moduleRef.get(SchedulerProcessor);
        processService = moduleRef.get(ProcessService);
        processSchedulerService = moduleRef.get(ProcessSchedulerService);
        botService = moduleRef.get(BotService);
        uiGateway = moduleRef.get(UiGateway);
        botWebSocketGateway = moduleRef.get(BotWebSocketGateway);
        processInstanceSchedulerService = moduleRef.get(ProcessInstanceSchedulerService);
        queueService = moduleRef.get(QueueService);
        queueMessageService = moduleRef.get(QueueMessageService);
    });

    it('should be defined', () => {
        expect(schedulerProcessor).toBeDefined();
    });

    describe('process', () => {
        it('should throw an error if job data is empty', async () => {
            await expect(schedulerProcessor.process({} as any)).rejects.toThrowError('Job data is empty');
        });

        it('should run process if it\'s not scheduled process', async () => {
            const result = await schedulerProcessor.process(JOB);
            expect(result).toBe(ORCHESTRATOR_INSTANCE_ID);
        });

        it('should run process if it\'s scheduled process', async () => {
            vi.spyOn(queueService, 'handleAttendedProcess');
            const result = await schedulerProcessor.process(SCHEDULED_JOB);
            expect(result).toBe(ORCHESTRATOR_INSTANCE_ID);
        });

        it('should not run process if it\'s attended process hasn\'t got required variables', async () => {
            vi.spyOn(queueService, 'handleAttendedProcess').mockRejectedValue(new Error('Some attended error'));
            await expect(schedulerProcessor.process(SCHEDULED_JOB)).rejects.toThrowError('Some attended error');
        });

        it('should not run process if it isn\'t bot collection available', async () => {
            vi.mock('#/utils/time', () => ({
                sleep: vi.fn().mockResolvedValue(undefined),
                SECOND: 1,
            }));
            vi.spyOn(botService, 'findAvailableCollection').mockResolvedValue([{ status: BotStatus.BUSY } as IBot]);
            await expect(schedulerProcessor.process(SCHEDULED_JOB)).rejects.toThrowError('Timeout: all bots are busy');
        });

        it('should not run process if it isn\'t any bot connected', async () => {
            vi.spyOn(botService, 'findAvailableCollection').mockResolvedValue([]);
            await expect(schedulerProcessor.process(SCHEDULED_JOB)).rejects.toThrowError('All bots are disconnected');
        });

        it('should not run process if user in trigger data is null', async () => {
            await expect(schedulerProcessor.process(JOB_WITHOUT_USER)).rejects.toThrowError();
        });
    });

    describe('onActive', () => {
        it('should emit WsMessage.ADD_WAITING_SCHEDULE with correct job data', async () => {
            vi.spyOn(processService, 'findById').mockResolvedValue({ id: PROCESS_ID } as any);
            vi.spyOn(queueService, 'getActiveJobs').mockResolvedValue([JOB] as any);
            vi.spyOn(queueService, 'getWaitingJobs').mockResolvedValue([] as any);
            await schedulerProcessor.onActive(JOB as Job);

            expect(processService.findById).toHaveBeenCalledWith(PROCESS_ID);
            expect(uiGateway.server.emit).toHaveBeenCalledWith(WsMessage.ADD_WAITING_SCHEDULE, JOB);
        });
    });

    describe('onComplete', () => {
        it('should emit WsMessage.REMOVE_WAITING_SCHEDULE when a job is completed', async () => {
            schedulerProcessor.onComplete(JOB);
            expect(uiGateway.server.emit).toHaveBeenCalledWith(WsMessage.REMOVE_WAITING_SCHEDULE, JOB);
        });
    });

    describe('onFailed', () => {
        it('should emit WsMessage.REMOVE_WAITING_SCHEDULE and log when a job fails', async () => {
            const error = new Error('Test error');
            schedulerProcessor.onFailed(JOB, error);
            expect(uiGateway.server.emit).toHaveBeenCalledWith(WsMessage.REMOVE_WAITING_SCHEDULE, JOB);
        });
    });

    describe('onError', () => {
        it('should log error without exceptions', async () => {
            const error = new Error('Test error');
            await expect(schedulerProcessor.onError(JOB, error)).resolves.toBeUndefined();
        });
    });
});
