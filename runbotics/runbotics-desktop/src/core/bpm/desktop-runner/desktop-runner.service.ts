import { ModuleRef } from '@nestjs/core';
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DesktopRunRequest, isStatefulActionHandler, isStatelessActionHandler } from 'runbotics-sdk';
import { readdirSync, existsSync, Dirent } from 'fs';
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
import { CloudExcelActionHandler } from '#action/microsoft/excel/automation';
import SharepointFileActionHandler from '#action/sharepoint/file';
import ApiRequestHandler from '#action/api-request';
import ApplicationActionHandler from '#action/application';
import AsanaActionHandler from '#action/asana';
import BrowserActionHandler from '#action/browser';
import GoogleActionHandler from '#action/google';
import JavaScriptActionHandler from '#action/rce';
import DesktopActionHandler from '#action/desktop';
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '#logger';

import { RuntimeService } from '../runtime';
import {
    ActionHandler,
    ExternalActionWorkerMap, ExternalHandlersMap, HandlersInstancesMap, InternalHandlersInstancesMap
} from './desktop-runner.types';
import { FINISHED_PROCESS_STATUSES } from './desktop-runner.utils';

@Injectable()
export class DesktopRunnerService implements OnModuleInit {
    private readonly logger = new RunboticsLogger(DesktopRunnerService.name);

    private readonly externalActionsWorkersMap: ExternalActionWorkerMap = new Map();
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
        private readonly cloudExcelActionHandler: CloudExcelActionHandler,
        private readonly sharepointFileActionHandler: SharepointFileActionHandler,
        private readonly variableActionHandler: VariablesActionHandler,
        private readonly desktopActionHandler: DesktopActionHandler
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
            .set('cloudExcel', cloudExcelActionHandler)
            .set('sharepointFile', sharepointFileActionHandler)
            .set('variables', variableActionHandler)
            .set('desktop', desktopActionHandler);
    }

    async onModuleInit() {
        // if (!process.env.RUNBOTICS_HOT_RELOAD || process.env.RUNBOTICS_HOT_RELOAD != 'true') {
        //     // this.logger.log("dist/worker-" + path.resolve("./resources/app.asar/dist/worker-example.js"))
        //     this.externalActionsWorker = createExternalActionWorker();
        // } else {
        //     this.logger.warn('Hot reload is on! Remember to turn it off in production env.');
        // }

        await this.loadExtensionsDirModules();

        this.runtimeService.processChange().subscribe(async data => {
            const isRootProcessFinished = FINISHED_PROCESS_STATUSES.includes(data.eventType) && !data.processInstance.rootProcessInstanceId;
            if (!isRootProcessFinished) return;

            await this.clearHandlers();
            await this.clearActionWorkers(data.processInstanceId);
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
                .filter(directoryEntry => this.detectExtensionsDirectories(directoryEntry))
                .map(directoryEntry => directoryEntry.name);
            this.logger.log('Number of extensions found: ' + extensions.length);

            for (const extension of extensions) {
                currentExtensionName = extension;
                const extensionPath = path.resolve(this.serverConfigService.extensionsDirPath, extension);
                this.logger.log(`Loading ${extension} extension`);
                await this.loadExternalModule(extensionPath);
                this.logger.log(`Success: Extension ${extension} loaded`);
            }
        } catch (e) {
            this.logger.error(`Error loading ${currentExtensionName ?? this.serverConfigService.extensionsDirPath} - ${e.message}`);
        }
    }

    async clearHandlers() {
        try {
            if (this.processHandlersInstancesMap.size === 0) return;

            const handlersNames = Array.from(this.processHandlersInstancesMap.keys()).join(', ');
            this.logger.log(`Tearing down action handlers sessions [${handlersNames}]`);
            await Promise.allSettled(
                Array.from(this.processHandlersInstancesMap.values()).map(handlerInstance => {
                    if (isStatefulActionHandler(handlerInstance)) {
                        return handlerInstance.tearDown();
                    } else {
                        this.logger.error(`No tear down method in handler ${handlerInstance.constructor.name}`);
                    }
                })
            );
        } catch (e) {
            this.logger.error('Error clearing handler', e);
        } finally {
            this.processHandlersInstancesMap.clear();
        }
    }

    async clearActionWorkers(processInstanceId: string) {
        try {
            if (this.externalActionsWorkersMap.get(processInstanceId)) {
                this.externalActionsWorkersMap.get(processInstanceId).removeAllListeners('message');
                await this.externalActionsWorkersMap.get(processInstanceId).terminate();
            }
        } catch (e) {
            this.logger.error('Error cleaning worker', e);
        } finally {
            this.externalActionsWorkersMap.delete(processInstanceId);
        }
    }

    async loadExternalModule(externalModule: string) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require(externalModule);
        if (!module) {
            throw new Error(`Missing default export in external module: ${externalModule}`);
        }

        // Default export of the external module is an object that contains keys and handlers classes
        const moduleEntries = Object.entries<ActionHandler>(module);
        if (moduleEntries.length === 0) {
            this.logger.error(`Module ${externalModule} handlers map has invalid structure or object is empty`);
            return;
        }

        for (const [key, handler] of moduleEntries) {
            // internalHandlersMap accepts only predefined keys but 'key' is a type of string
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (this.internalHandlersMap.get(key) || this.externalHandlersMap.get(key)) {
                this.logger.error(`Handler ${key} cannot be imported. Key already exists`);
                continue;
            }

            this.externalHandlersMap.set(key, handler);
            this.logger.log(`Success: Imported handler ${key} ${handler.name}`);
        }
    }

    async run(request: DesktopRunRequest) {
        let handlerInstance = null;
        try {
            for (const [key, handler] of this.internalHandlersMap) {
                if (!request.script.startsWith(key + '.')) continue;

                handlerInstance = handler;
                this.processHandlersInstancesMap.set(handler.constructor.name, handlerInstance);

                return await handlerInstance.run(request);
            }

            for (const [key, handler] of this.externalHandlersMap) {
                if (!request.script.startsWith(key + '.')) continue;

                // handler is just a source code of action handler class, so the name is available directly in handler object
                const activeProcessInstance = this.processHandlersInstancesMap.get(handler.name);
                handlerInstance = activeProcessInstance ?? new handler();

                // handlerInstance is an instance of action handler class, so the name is available via constructor field
                this.processHandlersInstancesMap.set(handlerInstance.constructor.name, handlerInstance);
                return await handlerInstance.run(request);
            }
            // TODO: handle throw error 'no action handler found for action request.script'
        } catch (e) {
            this.logger.error(
                `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Error running script`,
                e.message,
                e
            );
            throw e;
        } finally {
            // TODO: add to isStatelessActionHandler, check if handlerInstance exists
            if (isStatelessActionHandler(handlerInstance)) {
                this.logger.warn(
                    `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Tearing down instance of stateless handler: ${handlerInstance.constructor.name}`
                );
                this.processHandlersInstancesMap.delete(handlerInstance.constructor.name);
            }
        }

        const notFoundErrorMessage = `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Script ${request.script} not found`;
        this.logger.error(notFoundErrorMessage);
        throw new Error(notFoundErrorMessage);
    }

    private checkIfFileSystemEntryPresentInDirectory(directoryPath: string, directoryName: string, fileSystemEntires: string[]): boolean {
        const isPresent = fileSystemEntires.every(fileSystemEntry => {
            const path = directoryPath + '\\' + directoryName + '\\' + fileSystemEntry;
            return existsSync(path);
        });

        return isPresent;
    }

    private checkIfPackageManagerPresentInDirectory(directoryPath: string, directoryName: string, packageManagerFile: string[]) {
        const isPresent = packageManagerFile.some(packageFile => {
            const path = directoryPath + '\\' + directoryName + '\\' + packageFile;
            return existsSync(path);
        });

        return isPresent;
    }

    private detectExtensionsDirectories(directoryEntry: Dirent) {
        return (
            directoryEntry.isDirectory() &&
            !directoryEntry.name.startsWith('.') &&
            this.checkIfFileSystemEntryPresentInDirectory(directoryEntry.path, directoryEntry.name, [
                'dist',
                'node_modules',
                'package.json'
            ]) &&
            this.checkIfPackageManagerPresentInDirectory(directoryEntry.path, directoryEntry.name, [
                'package-lock.json',
                'yarn.lock',
                'pnpm-lock.yaml'
            ])
        );
    }
}