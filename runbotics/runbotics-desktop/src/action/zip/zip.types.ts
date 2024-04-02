import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { ZipAction } from 'runbotics-common';

export type UnzipFileActionInput = {
    fileName: string;
    path?: string;
};

export type ZipFileActionInput = {
    toZipPath: string;
    zipPath?: string;
};

export type ZipActionRequest =
    | DesktopRunRequest<ZipAction.UNZIP_FILE, UnzipFileActionInput>
    | DesktopRunRequest<ZipAction.ZIP_FILE, ZipFileActionInput>
