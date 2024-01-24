import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { FolderAction } from 'runbotics-common';

export type FolderDeleteActionInput = {
    name: string;
    recursive: boolean;
    path?: string;
};

export type FolderDisplayFilesActionInput = {
    name: string;
    path?: string;
};

export type FolderDisplayFilesActionOutput = string[] | null;

export type FolderActionRequest =
    | DesktopRunRequest<FolderAction.DELETE, FolderDeleteActionInput>
    | DesktopRunRequest<FolderAction.DISPLAY_FILES, FolderDisplayFilesActionInput>;
