import { Injectable } from '@nestjs/common';
import {
    BotWsMessage,
    DecryptedCredential,
    IBot,
    InstantProcess,
    IProcess,
} from 'runbotics-common';

import { Logger } from '#/utils/logger';
import { WebsocketService } from '#/websocket/websocket.service';

import { ProcessInputService } from './process-input.service';
import { SecretService } from '#/scheduler-database/secret/secret.service';
import { ProcessService } from '#/database/process/process.service';

@Injectable()
export class ProcessSchedulerService {
    private readonly logger = new Logger(ProcessSchedulerService.name);

    constructor(
        private readonly websocketService: WebsocketService,
        private readonly processService: ProcessService,
        private readonly processInputService: ProcessInputService,
        private readonly secretService: SecretService
    ) {}

    async startProcess(
        instantProcess: InstantProcess,
        bot: IBot,
        orchestratorProcessInstanceId: string
    ) {
        const fileVariables =
            await this.processInputService.uploadAttendedFiles(
                instantProcess.process,
                instantProcess.input,
                orchestratorProcessInstanceId
            );

        const mergedInstantProcess =
            this.processInputService.mergeInputVariables(
                instantProcess,
                fileVariables
            );

        const body = await this.createStartProcessBody(
            mergedInstantProcess,
            orchestratorProcessInstanceId
        );

        await this.websocketService.sendMessageByBotId(
            bot.id,
            BotWsMessage.START_PROCESS,
            body
        );

        return { orchestratorProcessInstanceId };
    }

    private async createStartProcessBody(
        instantProcess: InstantProcess,
        orchestratorProcessInstanceId: string
    ) {
        const processId = instantProcess.process.id;
        const credentials = await this.getDecryptedCredentials(processId);

        return {
            processId,
            credentials,
            orchestratorProcessInstanceId,
            input: instantProcess.input,
            trigger: instantProcess.trigger,
            ...(instantProcess.user && { userId: instantProcess.user.id }),
            ...(instantProcess.triggerData && {
                triggerData: instantProcess.triggerData,
            }),
        };
    }

    private async getDecryptedCredentials(
        processId: IProcess['id']
    ): Promise<DecryptedCredential[]> {
        const { credentials } =
            await this.processService.findByIdWithSecrets(processId);
        const areCredentialsValid =
            credentials && Array.isArray(credentials) && credentials.length > 0;

        if (!areCredentialsValid) {
            return [];
        }

        return credentials.map(({ id, name, template, attributes }) => ({
            id,
            name,
            template: template.name,
            attributes: attributes.map(({ id, name, secret }) => ({
                id,
                name,
                value: this.secretService.decrypt(secret),
            })),
        }));
    }
}
