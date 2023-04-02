import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from 'src/utils/logger';
import { InstantProcess, ProcessInput, BotWsMessage, IBot, IProcess } from 'runbotics-common';
import { randomUUID } from 'crypto';
import { WebsocketService } from 'src/websocket/websocket.service';
import { ProcessFileService } from './process-file.service';
import _ from 'lodash';

@Injectable()
export class ProcessSchedulerService {
    private readonly logger = new Logger(ProcessSchedulerService.name);

    constructor(
        private readonly websocketService: WebsocketService,
        private readonly processFileService: ProcessFileService,
    ) {}

    async startProcess(instantProcess: InstantProcess, bot: IBot) {
        const orchestratorProcessInstanceId = randomUUID();

        const fileVariables = await this.uploadAttendedFiles(instantProcess.process, instantProcess.input, orchestratorProcessInstanceId);

        const mergedInstantProcess = this.mergeInputVariables(instantProcess, fileVariables);
        
        const body = this.createStartProcessResponse(mergedInstantProcess, orchestratorProcessInstanceId);

        await this.websocketService.sendMessageByBotId(bot.id, BotWsMessage.START_PROCESS, body);

        return { orchestratorProcessInstanceId };
    }

    private mergeInputVariables(instantProcess: InstantProcess, fileVariables: unknown): InstantProcess {
        const variables = instantProcess.input.variables;

        Object.entries(fileVariables).forEach(([path, value]) => {
            _.set(variables, path, value);
        });

        const input = { variables };

        return { ...instantProcess, input };
    }

    private async uploadAttendedFiles(
        process: IProcess,
        input: ProcessInput,
        orchestratorProcessInstanceId: string,
    ) {
        if (!process.isAttended || process.schedules?.length > 0)
            return Promise.resolve({});

        const uiSchema = JSON.parse(process.executionInfo).uiSchema;
        const fileKeys = this.processFileService.getFileSchemaKeys(uiSchema);

        if (fileKeys.length <= 0)
            return Promise.resolve({});

        const fileVariables = {};

        for (const key of fileKeys) {
            const file = _.get(input.variables, key);
            if (!file) continue;
            const downloadLink = await this.processFileService.uploadFile(file, orchestratorProcessInstanceId)
                .catch(err => {
                    this.logger.error('Failed to upload process file -', err);
                    throw new InternalServerErrorException('Failed to upload file to OneDrive', err.message);
                });
            this.logger.log(`Uploaded file "${key}" to ${downloadLink}`);
            fileVariables[key] = downloadLink;
        }

        return Promise.resolve(fileVariables);
    }

    private createStartProcessResponse(instantProcess: InstantProcess, orchestratorProcessInstanceId: string) {
        return {
            orchestratorProcessInstanceId,
            processId: instantProcess.process.id,
            input: instantProcess.input,
            trigger: instantProcess.trigger,
            ...(instantProcess.user && { userId: instantProcess.user.id }),
            ...(instantProcess.triggerData && { triggerData: instantProcess.triggerData }),
        };
    }
}
