import { ModuleRef } from '@nestjs/core';
import { forwardRef, Inject, Injectable, OnModuleInit, Type } from '@nestjs/common';
import {
    DesktopRunRequest, DesktopRunResponse, StatefulActionHandler, StatelessActionHandler
} from 'runbotics-sdk';
import { Worker } from 'worker_threads';
import { readdirSync } from 'fs';
import path from 'path';
import get from 'lodash/get';
import set from 'lodash/set';

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
import { RunboticsLogger } from '#logger';

import { RuntimeService } from '../Runtime';
import { ExternalHandlers, Handlers } from './DesktopRunner.types';
import { FINISHED_PROCESS_STATUSES, STATEFUL_ACTION_HANDLER } from './DesktopRunner.utils';

@Injectable()
export class DesktopRunnerService implements OnModuleInit {
    private readonly logger = new RunboticsLogger(DesktopRunnerService.name);

    private readonly externalActionsWorkers: Record<string, Worker> = {};
    private handlers: Handlers = {};
    private externalHandlers: ExternalHandlers = {};

    // handler key, process instance id,
    private readonly handlerInstancesByMasterProcessInstanceId: Record<string, Record<string, any>> = {};


    constructor(
        private readonly moduleRef: ModuleRef,
        @Inject(forwardRef(() => RuntimeService))
        private readonly runtimeService: RuntimeService,

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
        this.handlers = {
            api: apiRequestHandler,
            application: applicationActionHandler,
            asana: asanaActionHandler,
            beeOffice: beeOfficeActionHandler,
            browser: browserActionHandler,
            csv: csvActionHandler,
            file: fileActionHandler,
            general: generalActionHandler,
            google: googleActionHandler,
            import: importActionHandler,
            jira: jiraActionHandler,
            loop: loopActionHandler,
            mail: mailActionHandler,
            javascript: javaScriptActionHandler,
            typescript: javaScriptActionHandler,
            sap: sapActionHandler,
            sharepointExcel: sharepointExcelActionHandler,
            sharepointFile: sharepointFileActionHandler,
            variables: variableActionHandler,
        };
    }

    async onModuleInit() {
        try {
            // if (!process.env.RUNBOTICS_HOT_RELOAD || process.env.RUNBOTICS_HOT_RELOAD != 'true') {
            //     // this.logger.log("dist/worker-" + path.resolve("./resources/app.asar/dist/worker-example.js"))
            //     this.externalActionsWorker = createExternalActionWorker();
            // } else {
            //     this.logger.warn('Hot reload is on! Remember to turn it off in production env.');
            // }
            await this.loadExternalModule('runbotics-actions-windows');
            this.logger.log('Loading extensions from dir: ' + process.env.RUNBOTICS_EXTENSION_DIR);
            if (process.env.RUNBOTICS_EXTENSION_DIR) {
                try {
                    const extensions = readdirSync(process.env.RUNBOTICS_EXTENSION_DIR, { withFileTypes: true })
                        .filter((dirent) => dirent.isDirectory())
                        .map((dirent) => dirent.name);
                    this.logger.log('Number of extensions found: ' + extensions.length);
                    for (const dir of extensions) {
                        const extensionPath = path.resolve(process.env.RUNBOTICS_EXTENSION_DIR + '/' + dir);
                        this.logger.log('Loading extension: ' + extensionPath);
                        await this.loadExternalModule(extensionPath);
                        this.logger.log('Loaded extension: ' + extensionPath);
                    }
                } catch (e) {
                    this.logger.error('Error loading extensions from dir: ' + process.env.RUNBOTICS_EXTENSION_DIR);
                }
            }
        } catch (e) {
            this.logger.error('Error occurred ' + e.message, e);
        }

        this.runtimeService.processChange().subscribe(async (data) => {
            if (!FINISHED_PROCESS_STATUSES.includes(data.eventType)
                && data.processInstance.rootProcessInstanceId
            ) {
                return;
            }

            this.pruneActionsStates(data.processInstanceId);

            try {
                if (this.externalActionsWorkers[data.processInstanceId]) {
                    this.externalActionsWorkers[data.processInstanceId].removeAllListeners('message');
                    await this.externalActionsWorkers[data.processInstanceId].terminate();
                }
            } catch (e) {
                this.logger.error('Error cleaning worker', e);
            } finally {
                delete this.externalActionsWorkers[data.processInstanceId];
            }
        });
    }

    async pruneActionsStates(processInstanceId: string) {
        try {
            if (!this.handlerInstancesByMasterProcessInstanceId[processInstanceId]) return;
            await Promise.allSettled(Object.values(this.handlerInstancesByMasterProcessInstanceId[processInstanceId])
                .map(handlerInstance => {
                    if (handlerInstance && handlerInstance.getType() === STATEFUL_ACTION_HANDLER) {
                        if ((handlerInstance as StatefulActionHandler).tearDown) {
                            (handlerInstance as StatefulActionHandler).tearDown();
                        } else {
                            this.logger.error(
                                'No tear down method in handler',
                                handlerInstance.constructor.name,
                            );
                        }
                    }
                }));
        } catch (e) {
            this.logger.error('Error cleaning handler', e);
        } finally {
            delete this.handlerInstancesByMasterProcessInstanceId[processInstanceId];
        }
    }

    async loadExternalModule(externalModule: string) {
        const module = await import(externalModule);
        if (!module) {
            throw new Error(`Missing default export in external module: ${externalModule}`);
        }

        // Default export of the external module is an object that contains keys and names/paths of the exported handlers
        const handlers: Record<string, string> = module.default;
        for (const [key, handler] of Object.entries(handlers)) {
            if (this.externalHandlers[key]) {
                this.logger.error('Handler: ' + key + ' cannot be imported as it already exists');
                continue;
            }

            this.externalHandlers[key] = {
                package: externalModule,
                // External module has to provide simple import path via 'exports' field in package.json or exact path to the module
                handler,
            };
            this.logger.log(`Imported handler: ${key} ${handler}`);
        }
    }

    // async resolveInternalModule(request: DesktopRunRequest<any>, clazz: string): Promise<any> {
    //     this.logger.log(`[${request.processInstanceId}] [${request.script}]  Resolving internal module: ` + clazz);
    //     const module = await import(clazz);
    //     if (!module.default) {
    //         this.logger.error(
    //             `[${request.processInstanceId}] [${request.script}]  Missing default export in module: ` + clazz,
    //         );
    //         throw new Error('Missing default export in module: ' + clazz);
    //     }
    //     const defaultClazz = module.default as Type<any>;
    //     const instance = await this.moduleRef.create(defaultClazz);
    //     return instance;
    // }

    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        let handlerInstance;
        try {
            for (const [key, service] of Object.entries(this.handlers)) {
                if (!request.script.startsWith(key)) continue;
                return await service.run(request);
            }
          
            for (const [key, service] of Object.entries(this.externalHandlers)) {
                if (!request.script.startsWith(key)) continue;

                handlerInstance = get(this.handlerInstancesByMasterProcessInstanceId, [
                    request.rootProcessInstanceId ?? request.processInstanceId,
                    service.handler,
                ]);

                if (!handlerInstance) {
                    const file = service.package + '/dist/' + service.handler;
                    delete require.cache[require.resolve(file)];
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const Handler = require(file);
                    handlerInstance = new Handler();
                }

                set(this.handlerInstancesByMasterProcessInstanceId,
                    [request.rootProcessInstanceId ?? request.processInstanceId, service.handler],
                    handlerInstance,
                );

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
                    `[${request.processInstanceId}] [${request.script}] Tearing down instance as it's stateless handler: ` +
                        handlerInstance.constructor.name,
                );
                delete this.handlerInstancesByMasterProcessInstanceId[request.rootProcessInstanceId][
                    handlerInstance.constructor.name
                ];
                handlerInstance = null;
            }
        }

        const notFoundErrorMessage = `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Script ${request.script} not found`;
        this.logger.error(notFoundErrorMessage);
        throw new Error(notFoundErrorMessage);
    }
}
