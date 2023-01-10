import { DesktopRunRequest, StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import { Injectable, OnModuleInit, Type } from '@nestjs/common';
import { StatefulActionHandler } from 'runbotics-sdk';
import { ImportActionHandler } from './actions/import/ImportActionHandler';
import { MailActionHandler } from './actions/mail/MailHandler';
import { LoopActionHandler } from './actions/loop/LoopActionHandler';
import { JIRAActionHandler } from './actions/jira/JIRAActionHandler';
import { BeeOfficeActionHandler } from './actions/beeoffice/BeeOfficeActionHandler';
import { RunboticsLogger } from './logger/RunboticsLogger';
import { FileActionHandler } from './actions/files/FileActionHandler';
import { VariablesActionHandler } from './actions/variables/VariablesActionHandler';
import { ModuleRef } from '@nestjs/core';
import { CsvActionHandler } from './actions/csv/CsvActionHandler';
import { SharepointExcelActionHandler } from './actions/sharepoint/SharepointActionHandler';
import GeneralAutomation from './actions/general/GeneralAutomation';
import { Worker } from 'worker_threads';
import { readdirSync } from 'fs';
import path from 'path';
import { SharepointFileActionHandler } from './actions/sharepoint/SharepointFileActionHandler';
import get from 'lodash/get';
import set from 'lodash/set';
import { RuntimeService } from './core/bpm/Runtime';
import { BackgroundPageApiRequestHandler } from './config/BackgroundPageApiRequestHandler';
import { ProcessInstanceStatus } from 'runbotics-common';

@Injectable()
export class DesktopRunnerService implements OnModuleInit {
    private readonly logger = new RunboticsLogger(DesktopRunnerService.name);
    private externalActionsWorkers: Record<string, Worker> = {};

    // handler key, process instance id,
    private handlerInstancesByMasterProcessInstanceId: Record<string, Record<string, any>> = {};

    handlers: Record<string, StatelessActionHandler> = {};
    dynamicHandlers: Record<
        string,
        {
            // clazz: Type<ActionHandler>,
            clazz: string;
            type: 'external' | 'internal';
            dependency?: string;
            instance: any;
        }
    > = {};
    externalPackages: Record<
        string,
        Record<
            string,
            {
                clazz: string;
                instance: any;
            }
        >
    > = {};

    constructor(
        private moduleRef: ModuleRef,
        private importActionHandler: ImportActionHandler,
        private mailActionHandler: MailActionHandler,
        private loopActionHandler: LoopActionHandler,
        private jiraActionHandler: JIRAActionHandler,
        private beeOfficeActionHandler: BeeOfficeActionHandler,
        private fileActionHandler: FileActionHandler,
        private csvActionHandler: CsvActionHandler,
        private variablesActionHandler: VariablesActionHandler,
        private sharepointExcelActionHandler: SharepointExcelActionHandler,
        private sharepointFileActionHandler: SharepointFileActionHandler,
        private generalAutomation: GeneralAutomation,
        private runtimeService: RuntimeService,
        private backgroundPageApiRequestHandler: BackgroundPageApiRequestHandler,
    ) {
        this.handlers = {
            general: generalAutomation,
            import: importActionHandler,
            mail: mailActionHandler,
            loop: loopActionHandler,
            jira: jiraActionHandler,
            beeOffice: beeOfficeActionHandler,
            file: fileActionHandler,
            csv: csvActionHandler,
            variables: variablesActionHandler,
            sharepointExcel: sharepointExcelActionHandler,
            sharepointFile: sharepointFileActionHandler,
            'api.': backgroundPageApiRequestHandler,
        };

        this.dynamicHandlers = {
            sap: {
                clazz: './actions/sap/SAPAutomation',
                type: 'internal',
                instance: undefined,
            },
            application: {
                clazz: './actions/application/ApplicationAutomation',
                type: 'internal',
                instance: undefined,
            },
            google: {
                clazz: './actions/google/GoogleActionHandler',
                type: 'internal',
                instance: undefined,
            },
            browser: {
                clazz: './actions/browser/BrowserAutomation',
                type: 'internal',
                instance: undefined,
            },
            javascript: {
                clazz: './actions/rce/JavaScriptActionHandler',
                type: 'internal',
                instance: undefined,
            },
            typescript: {
                clazz: './actions/rce/JavaScriptActionHandler',
                type: 'internal',
                instance: undefined,
            },
            asana: {
                clazz: './actions/asana/AsanaActionHandler',
                type: 'internal',
                instance: undefined,
            },
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
            switch (data.eventType) {
                case ProcessInstanceStatus.COMPLETED:
                case ProcessInstanceStatus.STOPPED:
                case ProcessInstanceStatus.ERRORED:
                    if (data.processInstanceId == data.processInstance.rootProcessInstanceId) {
                        try {
                            if (this.handlerInstancesByMasterProcessInstanceId[data.processInstanceId]) {
                                for (const handlerInstance of Object.values(
                                    this.handlerInstancesByMasterProcessInstanceId[data.processInstanceId],
                                )) {
                                    if (handlerInstance && handlerInstance.getType() == 'StatefulActionHandler') {
                                        if ((handlerInstance as StatefulActionHandler).tearDown) {
                                            await (handlerInstance as StatefulActionHandler).tearDown();
                                        } else {
                                            this.logger.error(
                                                'No tear down method in handler',
                                                handlerInstance.constructor.name,
                                            );
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            this.logger.error('Error cleaning handler', e);
                        } finally {
                            delete this.handlerInstancesByMasterProcessInstanceId[data.processInstanceId];
                        }

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
                    }
                    break;
            }
        });
    }

    async loadExternalModule(externalModule: string): Promise<void> {
        const module = await import(externalModule);
        const required = require(externalModule);
        if (!module) {
            this.logger.error(`Missing default export in external module: ` + externalModule);
        }

        const handlers: Record<string, string> = module.default;
        for (const [key, value] of Object.entries(handlers)) {
            if (this.dynamicHandlers[key]) {
                this.logger.error('Handler: ' + key + ' cannot be imported as it already exists');
            } else {
                this.dynamicHandlers[key] = {
                    type: 'external',
                    dependency: externalModule,
                    clazz: value,
                    instance: null,
                };
                this.logger.log(`Imported handler: ${key} ${value}`);
            }
        }

        // @ts-ignore
        // const ExcelAutomation = await import("runbotics-actions-windows/ExcelAutomation")
    }

    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        try {
            for (const [key, service] of Object.entries(this.handlers)) {
                if (request.script.startsWith(key)) {
                    return await service.run(request);
                }
            }
        } catch (e) {
            this.logger.error(
                `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Error running script`,
                (e as Error).message,
                e,
            );
            throw e;
        }

        try {
            for (const [key, service] of Object.entries(this.dynamicHandlers)) {
                if (request.script.startsWith(key)) {
                    let handlerInstance = get(this.handlerInstancesByMasterProcessInstanceId, [
                        request.rootProcessInstanceId,
                        service.clazz,
                    ]);
                    try {
                        if (!handlerInstance) {
                            if (service.type === 'external') {
                                const file = service.dependency + '/dist/' + service.clazz;
                                delete require.cache[require.resolve(file)];
                                const clazz = require(file);
                                handlerInstance = new clazz();
                            } else {
                                handlerInstance = await this.resolveInternalModule(request, service.clazz);
                            }
                        }
                        set(
                            this.handlerInstancesByMasterProcessInstanceId,
                            [request.rootProcessInstanceId, service.clazz],
                            handlerInstance,
                        );

                        return await handlerInstance.run(request);
                    } finally {
                        if (handlerInstance && handlerInstance.getType() == 'StatelessActionHandler') {
                            this.logger.warn(
                                `[${request.processInstanceId}] [${request.script}] Tearing down instance as it's stateless handler: ` +
                                    service.clazz,
                            );
                            delete this.handlerInstancesByMasterProcessInstanceId[request.rootProcessInstanceId][
                                service.clazz
                            ];
                            handlerInstance = null;
                        }
                    }
                }
            }
        } catch (e) {
            this.logger.error(
                `[${request.processInstanceId}] [${request.script}] Error running script`,
                (e as Error).message,
                e,
            );
            throw e;
        }

        this.logger.error(`[${request.processInstanceId}] [${request.script}] Script ${request.script} not found`);

        throw new Error(`[${request.processInstanceId}] [${request.script}] Script ${request.script} not found`);
    }

    async resolveInternalModule(request: DesktopRunRequest<any>, clazz: string): Promise<any> {
        this.logger.log(`[${request.processInstanceId}] [${request.script}]  Resolving internal module: ` + clazz);
        const module = require(clazz);
        if (!module.default) {
            this.logger.error(
                `[${request.processInstanceId}] [${request.script}]  Missing default export in module: ` + clazz,
            );
            throw new Error('Missing default export in module: ' + clazz);
        }
        const defaultClazz = module.default as Type<any>;
        const instance = await this.moduleRef.create(defaultClazz);
        return instance;
    }
}
