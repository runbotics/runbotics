import { Injectable } from '@nestjs/common';
import {
    BotWsMessage,
    DecryptedCredential,
    IBot,
    InstantProcess,
} from 'runbotics-common';

import { Logger } from '#/utils/logger';
import { WebsocketService } from '#/websocket/websocket.service';

import { ProcessInputService } from './process-input.service';
import { ProcessEntity } from '#/database/process/process.entity';
import { SecretService } from '#/scheduler-database/secret/secret.service';

@Injectable()
export class ProcessSchedulerService {
    private readonly logger = new Logger(ProcessSchedulerService.name);

    constructor(
        private readonly websocketService: WebsocketService,
        private readonly processInputService: ProcessInputService,
        private readonly secretService: SecretService,
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

        const body = this.createStartProcessBody(
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

    private createStartProcessBody(
        instantProcess: InstantProcess,
        orchestratorProcessInstanceId: string
    ) {
        const decryptedCredentials = this.getDecryptedCredentials(
            instantProcess.process as ProcessEntity
        );
        return {
            orchestratorProcessInstanceId,
            processId: instantProcess.process.id,
            input: instantProcess.input,
            trigger: instantProcess.trigger,
            ...(decryptedCredentials && { decryptedCredentials }),
            ...(instantProcess.user && { userId: instantProcess.user.id }),
            ...(instantProcess.triggerData && {
                triggerData: instantProcess.triggerData,
            }),
        };
    }

    private getDecryptedCredentials({
        credentials,
    }: ProcessEntity): DecryptedCredential[] {
        const areCredentialsValid =
            credentials && Array.isArray(credentials) && credentials.length > 0;

        if (!areCredentialsValid) {
            return null;
        }

        return credentials.map(({ name, template, attributes }) => ({
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
