import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { FolderAction } from 'runbotics-common';
import { FolderActionRequest, FolderDeleteActionInput } from './folder.types';
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

    run(request: FolderActionRequest) {
        switch (request.script) {
            case FolderAction.DELETE:
                return this.deleteFolder(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
