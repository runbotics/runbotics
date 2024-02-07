import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { ZipAction } from 'runbotics-common';

export type UnzipFileActionInput = {
    path: string;
    fileName: string;
};

export type ZipActionRequest =
    | DesktopRunRequest<ZipAction.UNZIP_FILE, UnzipFileActionInput>;
