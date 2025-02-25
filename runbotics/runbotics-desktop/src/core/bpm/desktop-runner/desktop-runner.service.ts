import { ModuleRef } from '@nestjs/core';
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
    DesktopRunRequest,
    isPluginHandler,
    isStatefulActionHandler,
    isStatefulInjectablePluginHandler,
    isStatefulStandalonePluginHandler,
    isStatelessActionHandler,
    isStatelessInjectablePluginHandler,
    isStatelessStandalonePluginHandler,
    PLUGIN_SERVICE,
} from '@runbotics/runbotics-sdk';
import { readdirSync, existsSync, Dirent } from 'fs';
import path from 'path';

import ImportActionHandler from '#action/import';
import MailActionHandler from '#action/mail';
import LoopActionHandler from '#action/loop';
import JiraCloudActionHandler from '#action/jira/jira-cloud';
import JiraServerActionHandler from '#action/jira/jira-server';
import BeeOfficeActionHandler from '#action/beeoffice';
import FileActionHandler from '#action/file';
import VariablesActionHandler from '#action/variable';
import CsvActionHandler from '#action/csv';
import GeneralActionHandler from '#action/general';
import { CloudExcelActionHandler } from '#action/microsoft/automation/excel';
import { CloudFileActionHandler } from '#action/microsoft/automation/file';
import ApiRequestHandler from '#action/api-request';
import ApplicationActionHandler from '#action/application';
import AsanaActionHandler from '#action/asana';
import BrowserActionHandler from '#action/browser';
import GoogleActionHandler from '#action/google';
import JavaScriptActionHandler from '#action/rce';
import DesktopActionHandler from '#action/desktop';
import FolderActionHandler from '#action/folder';
import ZipActionHandler from '#action/zip';
import VisualBasicActionHandler from '#action/visual-basic';
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '#logger';

import { RuntimeService } from '../runtime';
import {
    ActionHandler,
    ExternalActionWorkerMap,
    ExternalHandlersMap,
    HandlersInstancesMap,
    InternalHandlerKey,
    InternalHandlersInstancesMap,
    PluginHandlersMap,
} from './desktop-runner.types';
import {
    BOT_PLUGIN_DIR,
    FINISHED_PROCESS_STATUSES,
    MODULE_TYPE,
    PLUGIN_PREFIX,
} from './desktop-runner.utils';
import { ImageActionHandler } from '#action/image';


@Injectable()
export class DesktopRunnerService implements OnModuleInit {
    private readonly logger = new RunboticsLogger(DesktopRunnerService.name);

    private readonly externalActionsWorkersMap: ExternalActionWorkerMap = new Map();
    private readonly externalHandlersMap: ExternalHandlersMap = new Map();
    private readonly pluginHandlersMap: PluginHandlersMap = new Map();
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
        private readonly jiraCloudActionHandler: JiraCloudActionHandler,
        private readonly jiraServerActionHandler: JiraServerActionHandler,
        private readonly loopActionHandler: LoopActionHandler,
        private readonly mailActionHandler: MailActionHandler,
        private readonly javaScriptActionHandler: JavaScriptActionHandler,
        private readonly cloudExcelActionHandler: CloudExcelActionHandler,
        private readonly cloudFileActionHandler: CloudFileActionHandler,
        private readonly variableActionHandler: VariablesActionHandler,
        private readonly desktopActionHandler: DesktopActionHandler,
        private readonly visualBasicActionHandler: VisualBasicActionHandler,
        private readonly imageActionHandler: ImageActionHandler,
        private readonly folderActionHandler: FolderActionHandler,
        private readonly zipActionHandler: ZipActionHandler,
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
            .set('jiraCloud', jiraCloudActionHandler)
            .set('jiraServer', jiraServerActionHandler)
            .set('loop', loopActionHandler)
            .set('mail', mailActionHandler)
            .set('javascript', javaScriptActionHandler)
            .set('typescript', javaScriptActionHandler)
            .set('cloudExcel', cloudExcelActionHandler)
            .set('cloudFile', cloudFileActionHandler)
            .set('variables', variableActionHandler)
            .set('desktop', desktopActionHandler)
            .set('visualBasic', visualBasicActionHandler)
            .set('image', imageActionHandler)
            .set('folder', folderActionHandler)
            .set('zip', zipActionHandler);
    }

    async onModuleInit() {
        // if (!process.env.RUNBOTICS_HOT_RELOAD || process.env.RUNBOTICS_HOT_RELOAD != 'true') {
        //     // this.logger.log("dist/worker-" + path.resolve("./resources/app.asar/dist/worker-example.js"))
        //     this.externalActionsWorker = createExternalActionWorker();
        // } else {
        //     this.logger.warn('Hot reload is on! Remember to turn it off in production env.');
        // }

        await this.loadExternalModules(
            this.serverConfigService.pluginsDirPath,
            this.filterPlugins,
            this.loadPlugins,
            MODULE_TYPE.PLUGIN,
        );

        await this.loadExternalModules(
            this.serverConfigService.extensionsDirPath,
            this.filterExtensions,
            this.loadExtensions,
            MODULE_TYPE.ACTIONS,
        );

        this.runtimeService.processChange().subscribe(async data => {
            const isRootProcessFinished = FINISHED_PROCESS_STATUSES.includes(data.eventType) && !data.processInstance.rootProcessInstanceId;
            if (!isRootProcessFinished) return;

            await this.clearHandlers();
            await this.clearActionWorkers(data.processInstanceId);
        });
    }

    async loadExternalModules(
        dirPath: string,
        moduleFilter: (...args: any[]) => boolean,
        moduleLoader: (...args: any[]) => Promise<void>,
        moduleType: MODULE_TYPE,
    ) {
        if (!dirPath) {
            this.logger.warn(`External module dir not provided - skipping loading (${moduleType})`);
            return;
        }

        this.logger.log('Loading external modules from dir: ' + dirPath);

        const externalModules: string[] = [];
        try {
            externalModules.push(...readdirSync(dirPath, { withFileTypes: true })
                .filter(directoryEntry => moduleFilter.call(this, dirPath, directoryEntry))
                .map(directoryEntry => directoryEntry.name));
            this.logger.log('Number of external modules found: ' + externalModules.length);
        } catch (e) {
            this.logger.error(e.message);
        }

        let currentExternalModuleName: string;
        for (const externalModule of externalModules) {
            try {
                currentExternalModuleName = externalModule;
                const externalModulePath = path.resolve(dirPath, externalModule);
                this.logger.log(`Loading ${externalModule} external module`);
                await moduleLoader.call(this, externalModulePath);
                this.logger.log(`Success: External module ${externalModule} loaded`);
            } catch (e) {
                this.logger.error(`Error loading (${moduleType}) with module ${currentExternalModuleName ?? dirPath} - ${e.message}\n`);
            }
        }
    }

    async clearHandlers() {
        try {
            if (this.processHandlersInstancesMap.size === 0) return;

            const handlersNames = Array.from(this.processHandlersInstancesMap.keys()).join(', ');
            this.logger.log(`Tearing down action handlers sessions [${handlersNames}]`);
            await Promise.allSettled(
                Array.from(this.processHandlersInstancesMap.values()).map(handlerInstance => {
                    if (isStatefulActionHandler(handlerInstance) || isStatefulStandalonePluginHandler(handlerInstance)) {
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

    async loadPlugins(externalModule: string) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require(path.join(externalModule, BOT_PLUGIN_DIR));
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
            if (!isPluginHandler(handler.prototype)) continue;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (this.internalHandlersMap.has(key) || this.pluginHandlersMap.has(key)) {
                this.logger.error(`Plugin ${key} cannot be imported. Key already exists`);
                continue;
            }

            if (!key.startsWith(PLUGIN_PREFIX)) {
                this.logger.error(`Plugin ${key} cannot be imported. Invalid plugin prefix`);
                continue;
            }

            if (
                isStatefulStandalonePluginHandler(handler.prototype) ||
                isStatelessStandalonePluginHandler(handler.prototype)
            ) {
                this.pluginHandlersMap.set(key, handler);

                this.logger.log(`Success: Imported plugin ${key} ${handler.name}`);
                continue;
            }

            const internalHandlerKey = key.split('.')[1] as InternalHandlerKey;

            const internalHandler = this.internalHandlersMap.get(internalHandlerKey);
            if (!internalHandler) {
                this.logger.error(`Plugin ${key} cannot be injected. There is no internal handler matching key ${internalHandlerKey}`);
                continue;
            }

            Object.defineProperty(internalHandler, PLUGIN_SERVICE, {
                value: new handler(),
                writable: true,
            });

            this.pluginHandlersMap.set(key, handler);
            this.internalHandlersMap.set(internalHandlerKey, internalHandler);

            this.logger.log(`Success: Injected plugin ${key} ${handler.name}`);
        }
    }

    async loadExtensions(externalModule: string) {
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
            if (this.pluginHandlersMap.has(key)) {
                this.logger.warn(`Skipping, because key ${key} has been already loaded`);
                continue;
            }
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
                const script = request.script;
                if (
                    !script.startsWith(key + '.') &&
                    !script.replace(PLUGIN_PREFIX, '').startsWith(key + '.')
                ) continue;

                handlerInstance = handler;
                this.processHandlersInstancesMap.set(handler.constructor.name, handlerInstance);

                return await handlerInstance.run(request);
            }

            for (const [key, handler] of this.pluginHandlersMap) {
                if (
                    !request.script.includes(key) ||
                    isStatefulInjectablePluginHandler(handler.prototype) ||
                    isStatelessInjectablePluginHandler(handler.prototype)
                ) continue;

                handlerInstance = new handler();
                this.processHandlersInstancesMap.set(handlerInstance.constructor.name, handlerInstance);

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

            this.logger.error(`[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] handler not found`);

            throw new Error(`No handler found for action ${request.script}`);
        } catch (e) {
            this.logger.error(
                `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Error running script`,
                e.message,
                e
            );
            throw e;
        } finally {
            if (isStatelessActionHandler(handlerInstance) || isStatelessStandalonePluginHandler(handlerInstance)) {
                this.logger.warn(
                    `[${request.processInstanceId}] [${request.executionContext.id}] [${request.script}] Tearing down instance of stateless handler: ${handlerInstance.constructor.name}`
                );
                this.processHandlersInstancesMap.delete(handlerInstance.constructor.name);
            }
        }
    }

    private checkDirectoryIncludes(directoryPath: string, directoryName: string, expectedFiles: string[]): boolean {
        const isPresent = expectedFiles.every(fileSystemEntry => {
            const entryPath = directoryPath + path.sep + directoryName + path.sep + fileSystemEntry;
            return existsSync(entryPath);
        });

        return isPresent;
    }

    private checkPluginExists(directoryPath: string, directoryName: string) {
        const pluginPath = path.join(directoryPath, directoryName, BOT_PLUGIN_DIR);

        return existsSync(pluginPath);
    }

    private filterExtensions(dirPath: string, directoryEntry: Dirent) {
        const isValidActionsDirectory = this.detectExtensions(directoryEntry, dirPath);
        if (!isValidActionsDirectory) {
            this.logger.warn(`Path "${dirPath}/${directoryEntry.name}" is not a valid actions directory`);
        }
        return isValidActionsDirectory;
    }

    private detectExtensions(directoryEntry: Dirent, extensionsPath: string) {
        return directoryEntry.isDirectory()
            && !directoryEntry.name.startsWith('.')
            && this.checkDirectoryIncludes(
                extensionsPath,
                directoryEntry.name,
                ['dist', 'node_modules', 'package.json']
            );
    }

    private filterPlugins(dirPath: string, directoryEntry: Dirent) {
        const isValidPluginsDirectory = this.detectPlugins(directoryEntry, dirPath);
        if (!isValidPluginsDirectory) {
            this.logger.warn(`Path "${dirPath}/${directoryEntry.name}" is not a valid plugins directory`);
        }
        return isValidPluginsDirectory;
    }

    private detectPlugins(directoryEntry: Dirent, extensionsPath: string) {
        return directoryEntry.isDirectory()
            && !directoryEntry.name.startsWith('.')
            && this.checkPluginExists(extensionsPath, directoryEntry.name);
    }
}
