import { ModuleRef } from '@nestjs/core';
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
    DesktopRunRequest, StatefulActionHandler, StatelessActionHandler
} from 'runbotics-sdk';
import { readdirSync } from 'fs';
import path from 'path';

import ImportActionHandler from '#action/import';
import MailActionHandler from '#action/mail';
import LoopActionHandler from '#action/loop';
import JIRAActionHandler from '#action/jira';
import BeeOfficeActionHandler from '#action/beeoffice';
import FileActionHandler from '#action/file';
import VariablesActionHandler from '#action/variable';
import CsvActionHandler from '#action/csv';
import GeneralActionHandler from '#action/general';
import SharepointExcelActionHandler from '#action/sharepoint/excel';
import SharepointFileActionHandler from '#action/sharepoint/file';
import ApiRequestHandler from '#action/api-request';
import ApplicationActionHandler from '#action/application';
import AsanaActionHandler from '#action/asana';
import BrowserActionHandler from '#action/browser';
import GoogleActionHandler from '#action/google';
import JavaScriptActionHandler from '#action/rce';
import SapActionHandler from '#action/sap';
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '#logger';

import { RuntimeService } from '../Runtime';
import {
    ExternalActionWorkerMap, ExternalHandlersMap, HandlersInstancesMap, InternalHandlersInstancesMap
} from './DesktopRunner.types';
import { FINISHED_PROCESS_STATUSES } from './DesktopRunner.utils';

@Injectable()
export class DesktopRunnerService implements OnModuleInit {
    private readonly logger = new RunboticsLogger(DesktopRunnerService.name);

    private readonly externalActionsWorkers: ExternalActionWorkerMap = new Map();
    private readonly externalHandlersMap: ExternalHandlersMap = new Map();
    private readonly internalHandlersMap: InternalHandlersInstancesMap = new Map();
    private readonly processHandlersInstancesMap: HandlersInstancesMap = new Map();

    constructor(
        private readonly moduleRef: ModuleRef,
        @Inject(forwardRef(() => RuntimeService))
        private readonly runtimeService: RuntimeService,
        private readonly serverConfigService: ServerConfigService,

        private readonly apiRequestHandler: ApiRequestHandler,
        private readonly applicationActionHandler: ApplicationActionHandler,
        private readonly asanaActionHandler: AsanaActionHandler,
        private readonly beeOfficeActionHandler: BeeOfficeActionHandler,
        private readonly browserActionHandler: BrowserActionHandler,
        private readonly csvActionHandler: CsvActionHandler,
        private readonly fileActionHandler: FileActionHandler,
        private readonly generalActionHandler: GeneralActionHandler,
        private readonly googleActionHandler: GoogleActionHandler,
        private readonly importActionHandler: ImportActionHandler,
        private readonly jiraActionHandler: JIRAActionHandler,
        private readonly loopActionHandler: LoopActionHandler,
        private readonly mailActionHandler: MailActionHandler,
        private readonly javaScriptActionHandler: JavaScriptActionHandler,
        private readonly sapActionHandler: SapActionHandler,
        private readonly sharepointExcelActionHandler: SharepointExcelActionHandler,
        private readonly sharepointFileActionHandler: SharepointFileActionHandler,
        private readonly variableActionHandler: VariablesActionHandler,
    ) {
        this.internalHandlersMap
            .set('api', apiRequestHandler)
            .set('application', applicationActionHandler)
            .set('asana', asanaActionHandler)
            .set('beeOffice', beeOfficeActionHandler)
            .set('browser', browserActionHandler)
            .set('csv', csvActionHandler)
            .set('file', fileActionHandler)
            .set('general', generalActionHandler)
            .set('google', googleActionHandler)
            .set('import', importActionHandler)
            .set('jira', jiraActionHandler)
            .set('loop', loopActionHandler)
            .set('mail', mailActionHandler)
            .set('javascript', javaScriptActionHandler)
            .set('typescript', javaScriptActionHandler)
            .set('sap', sapActionHandler)
            .set('sharepointExcel', sharepointExcelActionHandler)
            .set('sharepointFile', sharepointFileActionHandler)
            .set('variables', variableActionHandler);
    }

    async onModuleInit() {
        // if (!process.env.RUNBOTICS_HOT_RELOAD || process.env.RUNBOTICS_HOT_RELOAD != 'true') {
        //     // this.logger.log("dist/worker-" + path.resolve("./resources/app.asar/dist/worker-example.js"))
        //     this.externalActionsWorker = createExternalActionWorker();
        // } else {
        //     this.logger.warn('Hot reload is on! Remember to turn it off in production env.');
        // }
        try {
            await this.loadExternalModule('runbotics-actions-windows');
        } catch(e) {
            this.logger.error('Error loading extensions from runbotics-actions-windows', e);
        }

        await this.loadExtensionsDirModules();

        this.runtimeService.processChange().subscribe(async (data) => {
            const isRootProcessFinished = FINISHED_PROCESS_STATUSES.includes(data.eventType)
                && !data.processInstance.rootProcessInstanceId;
            if (!isRootProcessFinished) return;

            await this.clearHandlers();

            try {
                if (this.externalActionsWorkers.get(data.processInstanceId)) {
                    this.externalActionsWorkers.get(data.processInstanceId).removeAllListeners('message');
                    await this.externalActionsWorkers.get(data.processInstanceId).terminate();
                }
            } catch (e) {
                this.logger.error('Error cleaning worker', e);
            } finally {
                this.externalActionsWorkers.delete(data.processInstanceId);
            }
        });
    }

    async loadExtensionsDirModules() {
        if (!this.serverConfigService.extensionsDirPath) {
            this.logger.warn('Extensions dir not provided - skipping');
            return;
        }

        this.logger.log('Loading extensions from dir: ' + this.serverConfigService.extensionsDirPath);
        let currentExtensionName: string;
        try {
            const extensions = readdirSync(this.serverConfigService.extensionsDirPath, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);
            this.logger.log('Number of extensions found: ' + extensions.length);

            for (const extension of extensions) {
                currentExtensionName = extension;
                const extensionPath = path.resolve(`${this.serverConfigService.extensionsDirPath}/${extension}`);
                this.logger.log(`Loading ${extension} extension`);
                await this.loadExternalModule(extensionPath);
                this.logger.log(`Success: Extension ${extension} loaded`);
            }
        } catch (e) {
            this.logger.error(`Error loading ${currentExtensionName ?? this.serverConfigService.extensionsDirPath}${': ' + e.message}`);
        }
    }

    async clearHandlers() {
        try {
            if (this.processHandlersInstancesMap.size === 0) return;

            await Promise.allSettled(Object.values(this.processHandlersInstancesMap)
                .map(handlerInstance => {
                    const hasTearDownMethod = handlerInstance
                        && handlerInstance instanceof StatefulActionHandler
                        && handlerInstance.tearDown;

                    if (hasTearDownMethod) {
                        handlerInstance.tearDown();
                    } else {
                        this.logger.error(`No tear down method in handler ${handlerInstance.constructor.name}`);
                    }
                }));
        } catch (e) {
            this.logger.error('Error cleaning handler', e);
        } finally {
            this.processHandlersInstancesMap.clear();
        }
    }

    async loadExternalModule(externalModule: string) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require(externalModule);
        if (!module) {
            throw new Error(`Missing default export in external module: ${externalModule}`);
        }

        // Default export of the external module is an object that contains keys and names/paths of the exported handlers
        const moduleEntries = Object.entries<string>(module);
        if (moduleEntries.length === 0) {
            this.logger.error(`Module ${externalModule} handlers map has invalid structure or object is empty`);
            return;
        }

        for (const [key, handlerName] of moduleEntries) {
            // @ts-ignore
            if (this.internalHandlersMap.get(key) || this.externalHandlersMap.get(key)) {
                this.logger.error(`Handler ${key} cannot be imported. Key already exists`);
                continue;
            }

            this.externalHandlersMap.set(key, {
                module,
                // External module has to provide simple import path via 'exports' field in package.json or exact path to the module
                handlerName,
            });
            this.logger.log(`Success: Imported handler ${key} ${handlerName}`);
        }
    }

    async run(request: DesktopRunRequest) {
        let handlerInstance;
        try {
            for (const [key, service] of this.internalHandlersMap) {
                if (!request.script.startsWith(key)) continue;
                return await service.run(request);
            }
          
            for (const [key, service] of this.externalHandlersMap) {
                if (!request.script.startsWith(key)) continue;

                handlerInstance = this.processHandlersInstancesMap.get(service.handlerName);

                if (!handlerInstance) {
                    const file = `${service.module}/dist/${service.handlerName}`;
                    delete require.cache[require.resolve(file)];
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const Handler = require(file);
                    handlerInstance = new Handler();
                }

                this.processHandlersInstancesMap.set(service.handlerName, handlerInstance);

                return await handlerInstance.run(request);
            }
        } catch (e) {
            this.logger.error(
                `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Error running script`,
                e.message,
                e,
            );
            throw e;
        } finally {
            if (handlerInstance && handlerInstance instanceof StatelessActionHandler) {
                this.logger.warn(
                    `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Tearing down instance of stateless handler: ` +
                        handlerInstance.constructor.name,
                );
                this.processHandlersInstancesMap.delete(handlerInstance.constructor.name);
                handlerInstance = null;
            }
        }

        const notFoundErrorMessage = `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Script ${request.script} not found`;
        this.logger.error(notFoundErrorMessage);
        throw new Error(notFoundErrorMessage);
    }
}
