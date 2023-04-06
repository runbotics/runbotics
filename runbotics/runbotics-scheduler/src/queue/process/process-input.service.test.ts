import { Test } from '@nestjs/testing';
import { InstantProcess, IProcess, TriggerEvent } from 'runbotics-common';
import { ProcessFileService } from './process-file.service';
import { ProcessInputService } from './process-input.service';

const PROCESS_ID = 2137;
const ORCHESTRATOR_PROCESS_INSTANCE_ID = '3c24ec6c-e0a2-4bc4-bfe8-8ce430c6ede9';
const UPLOADED_FILE_PATH = `RunBotics/${ORCHESTRATOR_PROCESS_INSTANCE_ID}/file.pdf`;

const INSTANT_PROCESS: InstantProcess = {
    process: {
        id: PROCESS_ID,
    },
    trigger: {
        name: TriggerEvent.API,
    },
    input: {
        variables: {
            fileVariable: 'Here should be base64 of uploaded file',
            objectTestVariable: {
                nestedStringTestVariable: 'nestedStringTestVariable',
                nestedNumberTestVariable: 'nestedNumberTestVariable',
                fileVariable: 'Here should be base64 of uploaded file',
                anotherNesting: {
                    fileVariable: 'Here should be base64 of uploaded file',
                },
            },
            stringTestVariable: 'stringTestVariable',
            numberTestVariable: 'numberTestVariable',
        },
    },
};

describe('ProcessInputService', () => {
    let processInputService: ProcessInputService;
    let processFileService: ProcessFileService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProcessInputService,
                ProcessFileService,
            ],
        })
            .overrideProvider(ProcessFileService)
            .useValue({
                uploadFile: vi.fn().mockReturnValue(UPLOADED_FILE_PATH),
                getFileSchemaKeys: vi.fn(() => []),
            })
            .compile();
        processInputService = module.get(ProcessInputService);
        processFileService = module.get(ProcessFileService);
    });

    it('should be defined', () => {
        expect(processInputService).toBeDefined();
    });

    describe('mergeInputVariables', () => {

        it('should merge input variables', () => {
            const mergedInstantProcess = processInputService.mergeInputVariables(INSTANT_PROCESS, {
                'fileVariable': UPLOADED_FILE_PATH,
                'objectTestVariable.fileVariable': UPLOADED_FILE_PATH,
                'objectTestVariable.anotherNesting.fileVariable': UPLOADED_FILE_PATH,
                'stringTestVariable': 'newStringTestVariable',
            });

            const expectedInstantProcess: InstantProcess = {
                ...INSTANT_PROCESS,
                input: {
                    variables: {
                        ...INSTANT_PROCESS.input.variables,
                        objectTestVariable: {
                            ...INSTANT_PROCESS.input.variables.objectTestVariable,
                            fileVariable: UPLOADED_FILE_PATH,
                            anotherNesting: {
                                fileVariable: UPLOADED_FILE_PATH,
                            },
                        },
                        fileVariable: UPLOADED_FILE_PATH,
                        stringTestVariable: 'newStringTestVariable',
                    },
                },
            };

            expect(mergedInstantProcess).toEqual(expectedInstantProcess);
        });

    });

    describe('uploadAttendedFiles', () => {
        it('should ignore unattended process', async () => {
            const unattendedProcess: IProcess = {
                ...INSTANT_PROCESS.process,
                isAttended: false,
            };

            const result = await processInputService.uploadAttendedFiles(unattendedProcess, INSTANT_PROCESS.input, ORCHESTRATOR_PROCESS_INSTANCE_ID);

            expect(result).toMatchObject({});
        });

        it('should ignore scheduled process', async () => {
            const scheduledProcess: IProcess = {
                ...INSTANT_PROCESS.process,
                isAttended: true,
                schedules: [ {
                    id: 1337,
                    cron: '* * * * *',
                } ],
            };

            const result = await processInputService.uploadAttendedFiles(scheduledProcess, INSTANT_PROCESS.input, ORCHESTRATOR_PROCESS_INSTANCE_ID);

            expect(result).toMatchObject({});
        });

        it('should ignore if no files in schema', async () => {
            const processWithExecutionInfo: IProcess = {
                ...INSTANT_PROCESS.process,
                isAttended: true,
                executionInfo: JSON.stringify({ uiSchema: {} }),
            };

            const result = await processInputService.uploadAttendedFiles(processWithExecutionInfo, INSTANT_PROCESS.input, ORCHESTRATOR_PROCESS_INSTANCE_ID);

            expect(result).toMatchObject({});
        });

        it('should upload files', async () => {
            const processWithExecutionInfo: IProcess = {
                ...INSTANT_PROCESS.process,
                isAttended: true,
                executionInfo: JSON.stringify({ uiSchema: {} }),
            };

            vi.spyOn(processFileService, 'getFileSchemaKeys').mockReturnValue([ 'fileVariable', 'objectTestVariable.fileVariable', 'objectTestVariable.anotherNesting.fileVariable' ]);
            vi.spyOn(processFileService, 'uploadFile').mockReturnValue(Promise.resolve(UPLOADED_FILE_PATH));

            const result = await processInputService.uploadAttendedFiles(processWithExecutionInfo, INSTANT_PROCESS.input, ORCHESTRATOR_PROCESS_INSTANCE_ID);

            expect(result).toEqual({
                'fileVariable': UPLOADED_FILE_PATH,
                'objectTestVariable.fileVariable': UPLOADED_FILE_PATH,
                'objectTestVariable.anotherNesting.fileVariable': UPLOADED_FILE_PATH,
            });
        });
    });

});
