import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from 'src/utils/logger';
import { InstantProcess, ProcessInput, BotWsMessage, IBot, IProcess } from 'runbotics-common';
import { v4 as uuidv4 } from 'uuid';
import { WebsocketService } from 'src/websocket/websocket.service';
import { FileUploadService } from '../upload/file-upload.service';
import { MicrosoftSessionService } from 'src/auth/microsoft.session';
import _ from 'lodash';

@Injectable()
export class ProcessSchedulerService {
    private readonly logger = new Logger(ProcessSchedulerService.name);

    constructor(private readonly websocketService: WebsocketService,
        private readonly fileUploadService: FileUploadService,
        private readonly microsoftSessionService: MicrosoftSessionService) {
    }

    private async handleUploadedFiles(process: IProcess, input: ProcessInput, orchestratorProcessInstanceId: string) {
        const uiSchema = JSON.parse(process.executionInfo).uiSchema;
        const fileKeys = this.fileUploadService.getFileKeysFromSchema(uiSchema);

        if (fileKeys.length <= 0) return;

        const token = await this.microsoftSessionService.getToken()
            .catch(err => {
                this.logger.error('Failed to get microsoft bearer token', err);
                throw new BadRequestException('Failed authenticating with sharepoint');
            });

        for (const key of fileKeys) {
            const file = _.get(input.variables, key);
            if (!file) continue;
            const downloadLink = await this.fileUploadService.uploadFile(token.token, file, orchestratorProcessInstanceId)
                .catch(err => {
                    this.logger.error('Failed to upload file', err);
                    throw new InternalServerErrorException('Failed uploading file to sharepoint' + err?.message ?? '');
                });
            this.logger.log(`Uploaded file ${key} to ${downloadLink}`);
            input.variables = _.set(input.variables, key, downloadLink);
        }
    }

    async startProcess(instantProcess: InstantProcess, bot: IBot) {
        const orchestratorProcessInstanceId = uuidv4();

        if (instantProcess.process?.isAttended) {
            await this.handleUploadedFiles(instantProcess.process, instantProcess.input, orchestratorProcessInstanceId);
        }

        const body = this.createStartProcessResponse(instantProcess, orchestratorProcessInstanceId);

        await this.websocketService.sendMessageByBotId(bot.id, BotWsMessage.START_PROCESS, body);

        return { orchestratorProcessInstanceId: body.orchestratorProcessInstanceId };
    }

    private createStartProcessResponse(instantProcess: InstantProcess, orchestratorProcessInstanceId: string) {
        return {
            orchestratorProcessInstanceId,
            processId: instantProcess.process.id,
            input: instantProcess.input,
            trigger: instantProcess.trigger,
            ...(instantProcess.user && { userId: instantProcess.user.id }),
            ...(instantProcess.triggeredBy && { triggeredBy: instantProcess.triggeredBy }),
        };
    }
}
