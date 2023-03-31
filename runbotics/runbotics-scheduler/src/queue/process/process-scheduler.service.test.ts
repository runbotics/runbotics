import { Test } from '@nestjs/testing';
import { IBot, InstantProcess } from 'runbotics-common';
import { WebsocketService } from '#/websocket/websocket.service';
import { ProcessFileService } from './process-file.service';
import { ProcessSchedulerService } from './process-scheduler.service';
// import { randomUUID } from 'crypto';
import { TriggerEvent } from 'runbotics-common';

// jest.mock('crypto');

// const mockedRandomUUID = randomUUID as jest.Mock<string>;
const PROCESS_ID = 2137;
const BOT_ID = 7312;
const ORCHESTRATOR_PROCESS_INSTANCE_ID = '3c24ec6c-e0a2-4bc4-bfe8-8ce430c6ede9';
// mockedRandomUUID.mockReturnValue(ORCHESTRATOR_PROCESS_INSTANCE_ID);

const instantProcess: InstantProcess = {
    process: {
        id: PROCESS_ID,
    },
    trigger: {
        name: TriggerEvent.API,
    },
    input: {
        variables: {
            objectTestVariable: {
                nestedStringTestVariable: 'nestedStringTestVariable',
                nestedNumberTestVariable: 'nestedNumberTestVariable',
                fileVariable: 'Here should be base64 of uploaded file',
            },
            stringTestVariable: 'stringTestVariable',
            numberTestVariable: 'numberTestVariable',
        }
    }
};

const bot: IBot = {
    id: BOT_ID,
};

describe('ProcessSchedulerService', () => {
    let websocketService: WebsocketService;
    let processFileService: ProcessFileService;
    let processSchedulerService: ProcessSchedulerService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProcessSchedulerService,
                // {
                //     provide: ProcessSchedulerService,
                //     useValue: {
                //         uploadAttendedFiles: jest.fn().mockReturnValue({
                //             fileVariable: `RunBotics/${ORCHESTRATOR_PROCESS_INSTANCE_ID}`,
                //         }),
                //     }
                // },
                {
                    provide: ProcessFileService,
                    useValue: {
                        uploadFile: jest.fn().mockReturnValue(`RunBotics/${ORCHESTRATOR_PROCESS_INSTANCE_ID}/file.pdf`)
                    }
                },
                {
                    provide: WebsocketService,
                    useValue: {
                        sendMessageByBotId: jest.fn()
                    }
                }
            ],
        }).compile();
        processSchedulerService = module.get(ProcessSchedulerService);
        websocketService = module.get(WebsocketService);
        processFileService = module.get(ProcessFileService);
    });

    it('should be defined', () => {
        expect(processSchedulerService).toBeDefined();
    });
    
    describe('mergeInputVariables', () => {
        
        it('should merge variables', () => {

            const mergedInstantProcess = processSchedulerService.mergeInputVariables(instantProcess, {
                'objectTestVariable.fileVariable': `RunBotics/${ORCHESTRATOR_PROCESS_INSTANCE_ID}/file.pdf`,
                'objectTestVariable.anotherNesting.fileVariable': `RunBotics/${ORCHESTRATOR_PROCESS_INSTANCE_ID}/file.pdf`,
                'stringTestVariable': 'newStringTestVariable',
            });

            expect(JSON.stringify(mergedInstantProcess.input.variables)).toBe(JSON.stringify({
                ...instantProcess.input.variables,
                objectTestVariable: {
                    ...instantProcess.input.variables.objectTestVariable,
                    fileVariable: `RunBotics/${ORCHESTRATOR_PROCESS_INSTANCE_ID}/file.pdf`,
                    anotherNesting: {
                        fileVariable: `RunBotics/${ORCHESTRATOR_PROCESS_INSTANCE_ID}/file.pdf`,
                    }
                },
                stringTestVariable: 'newStringTestVariable',
            }));
        });

    });
    
});
