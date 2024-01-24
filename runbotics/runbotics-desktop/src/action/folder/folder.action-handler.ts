import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { FolderAction } from 'runbotics-common';
import { FolderActionRequest, FolderDeleteActionInput, FolderDisplayFilesActionInput, FolderDisplayFilesActionOutput } from './folder.types';
import fs from 'fs';
import pathPackage from 'path';
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '../../logger';

@Injectable()
export default class FolderActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(FolderActionHandler.name);

    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }

    async deleteFolder(input: FolderDeleteActionInput) {
        const { name, recursive, path } = input;

        const folderPath = path ?
            `${path}${pathPackage.sep}${name}` :
            `${this.serverConfigService.tempFolderPath}${pathPackage.sep}${name}`;

        try {
            fs.rmdirSync(folderPath, { recursive });
        } catch (e) {
            if (e.code === 'ENOENT') {
                throw new Error(`Directory not found: ${folderPath}`);
            } else if (e.code === 'EACCES' || e.code === 'EPERM') {
                throw new Error(`Remove directory permission denied: ${folderPath}`);
            } else if (e.code === 'ENOTEMPTY') {
                throw new Error(`Cannot remove not empty directory without setting 'recursive' option: ${folderPath}`);
            } else {
                throw new Error(`Directory could not be removed. ${e}`);
            }
        }
    }

    async displayFiles(input: FolderDisplayFilesActionInput): Promise<FolderDisplayFilesActionOutput | null> {
        const { name, path } = input;
        
        const folderPath = path ?
            `${path}${pathPackage.sep}${name}` :
            `${this.serverConfigService.tempFolderPath}${pathPackage.sep}${name}`;

        try {
            return fs.readdirSync(folderPath);
        } catch (e) {
            if (e.code === 'ENOENT') {
                throw new Error(`Directory not found: ${folderPath}`);
            } else if (e.code === 'EACCES' || e.code === 'EPERM') {
                throw new Error(`Read directory permission denied: ${folderPath}`);
            }
        }
    }

    run(request: FolderActionRequest) {
        switch (request.script) {
            case FolderAction.DELETE:
                return this.deleteFolder(request.input);
            case FolderAction.DISPLAY_FILES:
                return this.displayFiles(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
