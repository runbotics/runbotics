import { Injectable, NotFoundException } from '@nestjs/common';
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
import { ProcessService } from '#/scheduler-database/process/process.service';
import { findSubprocess } from '#/utils/bpmn/findSubprocess';

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
        const processDef = instantProcess.process.definition;
        const credentials = await this.getDecryptedCredentials(
            processId,
            processDef
        );

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
        processId: IProcess['id'],
        definition: IProcess['definition']
    ): Promise<DecryptedCredential[]> {
        const processDecryptedCredentials = await this.handleProcessCredentials(
            processId
        );

        const subprocessIds = await findSubprocess(definition);
        if (subprocessIds && subprocessIds.length) {
            const subprocessDecryptedCredentials =
                await this.handleSubprocessCredentials(subprocessIds);

            return this.filterDuplicatedCredentials([
                ...processDecryptedCredentials,
                ...subprocessDecryptedCredentials,
            ]);
        }

        return this.filterDuplicatedCredentials(processDecryptedCredentials);
    }

    private async handleProcessCredentials(
        processId: IProcess['id']
    ): Promise<DecryptedCredential[]> {
        const process = await this.processService.findByIdWithSecrets(
            processId
        );

        if (!process) {
            throw new NotFoundException(
                `Cannot find process with ID ${processId}`
            );
        }

        const processCredentials = process.processCredential;
        const areCredentialsValid =
            processCredentials &&
            Array.isArray(processCredentials) &&
            processCredentials.length > 0;

        const processDecryptedCredentials = areCredentialsValid
            ? processCredentials.map(
                  ({
                      order,
                      credential: { id, name, template, attributes },
                  }) => ({
                      id,
                      name,
                      order,
                      template: template.name,
                      attributes: attributes.map(({ id, name, secret }) => ({
                          id,
                          name,
                          value: this.secretService.decrypt(secret),
                      })),
                  })
              )
            : [];

        return processDecryptedCredentials;
    }

    private async handleSubprocessCredentials(
        subprocessIds: IProcess['id'][]
    ): Promise<DecryptedCredential[]> {
        const subprocessDecryptedCredentials = await Promise.all(
            subprocessIds.map(async (subprocessId) => {
                const subprocess = await this.processService.findById(
                    subprocessId
                );

                if (!subprocess) {
                    throw new NotFoundException(
                        `Cannot find subprocess with ID ${subprocessId}`
                    );
                }

                const subprocessDefinition = subprocess.definition;
                const subprocessDecryptedCredentials =
                    await this.getDecryptedCredentials(
                        subprocessId,
                        subprocessDefinition
                    );

                return subprocessDecryptedCredentials;
            })
        );

        return subprocessDecryptedCredentials.flat();
    }

    private filterDuplicatedCredentials(
        decryptedCredentials: DecryptedCredential[]
    ): DecryptedCredential[] {
        const decryptedCredentialsMap = new Map();
        for (const credential of decryptedCredentials) {
            if (decryptedCredentialsMap.has(credential.id)) continue;
            decryptedCredentialsMap.set(credential.id, credential);
        }

        return [...decryptedCredentialsMap.values()];
    }
}
