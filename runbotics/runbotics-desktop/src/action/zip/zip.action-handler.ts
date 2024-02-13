import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { ZipAction } from 'runbotics-common';
import { ZipActionRequest, UnzipFileActionInput } from './zip.types';
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '../../logger';
import pathPackage from 'path';
import AdmZip from 'adm-zip'

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

    run(request: ZipActionRequest) {
        switch (request.script) {
            case ZipAction.UNZIP_FILE:
                return this.unzipFile(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
