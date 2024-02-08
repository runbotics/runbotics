import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { FolderAction } from 'runbotics-common';
import { FolderActionRequest, FolderCreateActionInput, FolderDeleteActionInput, FolderDisplayFilesActionInput } from './folder.types';
import fs from 'fs';
import pathPackage from 'path';
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '../../logger';

@Injectable()
export default class FolderActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(FolderActionHandler.name);

    constructor(
        private readonly serverConfigService: ServerConfigService
    ) {
        super();
    }

    resolvePath(name?: string, path?: string): string {
        const folderPath = path ?? this.serverConfigService.tempFolderPath;
        return name ? `${folderPath}${pathPackage.sep}${name}` : folderPath;
    }

    async deleteFolder(input: FolderDeleteActionInput) {
        const { name, recursive, path } = input;

        const folderPath = this.resolvePath(name, path);

        try {
            fs.rmdirSync(folderPath, { recursive });
        } catch (e) {
            this.handleFolderActionError('Delete folder', e, folderPath);
        }
    }

    async displayFiles(input: FolderDisplayFilesActionInput): Promise<string[] | null> {
        const { name, path } = input;

        const folderPath = this.resolvePath(name, path);

        try {
            return fs.readdirSync(folderPath);
        } catch (e) {
            this.handleFolderActionError('Display files', e, folderPath);
        }
    }

    async createFolder(input: FolderCreateActionInput) {
        const { name, path } = input;

        if (!name) {
            throw new Error('Cannot create directory if name is not provided');
        }

        const folderPath = this.resolvePath(name, path);

        try {
            fs.mkdirSync(folderPath);
            return `${path}${pathPackage.sep}${name}`;
        } catch (e) {
            this.handleFolderActionError('Create folder', e, folderPath);
        }
    }

    handleFolderActionError(actionName: string, e: any, folderPath: string) {
        switch (e.code) {
            case 'ENOENT':
                throw new Error(`${actionName}: Directory not found: ${folderPath}`);
            case 'EACCES':
            case 'EPERM':
                throw new Error(`${actionName}: Directory permission denied: ${folderPath}`);
            case 'EEXIST':
                throw new Error(`${actionName}: Cannot perform action - folder with this name already exists in the provided folder path`);
            case 'ENOTEMPTY':
                throw new Error(`${actionName}: Cannot perform action on empty directory without setting 'recursive' option: ${folderPath}`);
            default:
                throw new Error(`${actionName}: Action could not be performed ${e}`);
        }
    }

    run(request: FolderActionRequest) {
        switch (request.script) {
            case FolderAction.DELETE:
                return this.deleteFolder(request.input);
            case FolderAction.DISPLAY_FILES:
                return this.displayFiles(request.input);
            case FolderAction.CREATE:
                return this.createFolder(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
