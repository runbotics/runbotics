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

    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }

    resolvePath(name: string, path?: string): string {
        const folderPath = path ?? this.serverConfigService.tempFolderPath;
        return `${folderPath}${pathPackage.sep}${name}`;
    }

    async unzipFile(input: UnzipFileActionInput) {
        const { path, fileName } = input;

        try {
            const fullPath = this.resolvePath(fileName, path);
            const zip = new AdmZip(`${fullPath}.zip`);
            zip.extractAllTo(fullPath);
        } catch (e) {
            throw new Error(`Archive unzip failed with error: ${e}`);
        }
    }

    async zipFile(input: ZipFileActionInput) {
        const { path, fileName } = input;

        if (!path) {
            throw new Error('Path to a folder is mandatory'
            );
        }

        const { parentPath, pathToZipFolder } = this.getNewFolderPath(fileName, path);

        try {
            const zip = new AdmZip();
            // const content = fs.readdirSync(parentPath);
            zip.addLocalFolder(pathToZipFolder);
            zip.writeZip(`${pathToZipFolder}`);
        } catch (e) {
            throw new Error(`Create archived zip failes with error: ${e}`);
        }
    }

    getNewFolderPath(newName: string, path: string) {
        if (!newName) {
            return {parentPath: path, pathToZipFolder: path};
        }

        const lastSlashOccuranceIndex = path.lastIndexOf(pathPackage.sep);
        const parentPath = `${path.substring(0, lastSlashOccuranceIndex)}`;

        const pathToZipFolder = `${parentPath}}${pathPackage.sep}${newName}`;

        return { parentPath, pathToZipFolder }; 
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
