import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { ZipAction } from 'runbotics-common';
import { ZipActionRequest, UnzipFileActionInput, ZipFileActionInput } from './zip.types';
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '../../logger';
import pathPackage from 'path';
import AdmZip from 'adm-zip';
import fs from 'fs';

@Injectable()
export default class ZipActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(ZipActionHandler.name);

    constructor(private readonly serverConfigService: ServerConfigService) {
        super();
    }

    resolvePath(name: string, path?: string): string {
        const folderPath = path ?? this.serverConfigService.tempFolderPath;
        return `${folderPath}${pathPackage.sep}${name}`;
    }

    async unzipFile(input: UnzipFileActionInput) {
        const { path, fileName } = input;
        const fullPath = this.resolvePath(fileName, path);

        if (!fileName) {
            throw new Error('File name is mandatory');
        }

        if (fs.existsSync(fullPath)) {
            throw new Error('File/folder with this name already exists');
        }

        try {
            const zip = new AdmZip(`${fullPath}.zip`);
            zip.extractAllTo(fullPath);
        } catch (e) {
            this.handleError('Unzip archive', e.code);
        }
    }

    async zipFile(input: ZipFileActionInput) {
        const { fileName, path, zipName } = input;

        if (!fileName) {
            throw new Error('File name is mandatory');
        }
        
        try {
            const fullPathToZip = this.resolvePath(fileName, path);
            const isDirectory = this.isDirectory(fullPathToZip);
            const pathToZip = this.getNewFolderPath(zipName, fullPathToZip);
    
            if (fs.existsSync(`${pathToZip}.zip`)) throw {code: 'EBUSY'};

            const zip = new AdmZip();
            if (isDirectory) {
                zip.addLocalFolder(fullPathToZip);
            } else {
                zip.addLocalFile(fullPathToZip);
            }

            zip.writeZip(`${pathToZip}.zip`);
            return `${pathToZip}.zip`;
        } catch (e) {
            this.handleError('Create archive', e.code);
        }
    }

    private getNewFolderPath(newName: string, path: string) {
        const { dir, name } = pathPackage.parse(path);

        if (!newName) {
            return `${dir}${pathPackage.sep}${name}`;
        }

        return `${dir}${pathPackage.sep}${newName}`;
    }

    private isDirectory(path: string) {
        const stat = fs.lstatSync(path);
        return stat.isDirectory();
    }

    private handleError(actionName: string, error: string) {
        switch (error) {
            case 'EBUSY':
                throw new Error(`${actionName} action: File with this name already exists.`);
            case 'ENOENT':
                throw new Error(`${actionName}: no such file or directory`);
            case 'EACCES':
            case 'EPERM':
                throw new Error(`${actionName}: Directory permission denied`);
            default:
                throw new Error(`${actionName} action failed with error: ${error}`);
        }
    }

    run(request: ZipActionRequest) {
        switch (request.script) {
            case ZipAction.UNZIP_FILE:
                return this.unzipFile(request.input);
            case ZipAction.ZIP_FILE:
                return this.zipFile(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
