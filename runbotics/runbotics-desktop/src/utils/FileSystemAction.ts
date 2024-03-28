import { ServerConfigService } from '#config';
import { ActionRegex } from 'runbotics-common';
import pathPackage from 'path';


export default class FileSystemAction {
    constructor(private readonly serverConfigService: ServerConfigService) {}

    resolvePath(name: string, path?: string): string {
        const folderPath = path ?? this.serverConfigService.tempFolderPath;
        return `${folderPath}${pathPackage.sep}${name}`;
    }

    isFilePathAbsolute(path: string) {
        const windowsAbsPathBegining = new RegExp (ActionRegex.WINDOWS_ABSOLUTE_PATH);
        const linuxAbsPathBegining = new RegExp (ActionRegex.LINUX_ABOSLUTE_PATH);
    
        if (windowsAbsPathBegining.test(path) || linuxAbsPathBegining.test(path)) {
            return true;
        }
    
        return false;
    }

    getAbsolutePath(path: string) {
        return this.isFilePathAbsolute(path) ? path : this.resolvePath(path);
    }
}