import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { ZipAction } from 'runbotics-common';
import { ZipActionRequest, UnzipFileActionInput, ZipFileActionInput } from './zip.types';
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '../../logger';
import { handleFileSystemError } from '#utils/fileSystemError';
import { isFilePathAbsolute } from '#utils';
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
            handleFileSystemError('Unzip archive', e);
        }
    }

    async zipFile(input: ZipFileActionInput) {
        const { toZipPath, zipPath } = input;

        if (!toZipPath) {
            throw new Error('Path to the file/folder to archive is mandatory'
            );
        }

        const fullToZipPath = isFilePathAbsolute(toZipPath) ? toZipPath : this.resolvePath(toZipPath);
        const isDirectory = this.isDirectory(fullToZipPath);
        const fullZipPath = isFilePathAbsolute(zipPath) ? zipPath : `${this.resolvePath(this.getZipFileName(toZipPath))}.zip)`;
        
        try {
            if (fs.existsSync(fullZipPath)) throw { code: 'EBUSY' };

            const zip = new AdmZip();
            if (isDirectory) {
                zip.addLocalFolder(fullToZipPath);
                zip.writeZip(`${fullZipPath}`);
            } else {
                zip.addLocalFile(fullToZipPath);
                zip.writeZip(this.getZipPath(fullZipPath));
            }

            return fullZipPath;
        } catch (e) {
            handleFileSystemError('Create archive', e);
        }
    }

    private isDirectory(path: string) {
        const stat = fs.lstatSync(path);
        return stat.isDirectory();
    }

    private getZipPath(path: string) {
        const { dir, name } = pathPackage.parse(path);

        return `${dir}${pathPackage.sep}${name}.zip`;
    }

    private getZipFileName(path: string) {
        const { name } = pathPackage.parse(path);

        return name;
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
