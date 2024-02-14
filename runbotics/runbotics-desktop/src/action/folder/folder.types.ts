import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { FolderAction } from 'runbotics-common';

export type FolderDeleteActionInput = {
    name: string;
    recursive: boolean;
    path?: string;
};

export type FolderDisplayFilesActionInput = {
    name?: string;
    path?: string;
};

export type FolderCreateActionInput = {
    name: string;
    path?: string;
};

export type FolderRenameActionInput = {
    path: string;
    newName: string;
};

export type FolderActionRequest =
    | DesktopRunRequest<FolderAction.DELETE, FolderDeleteActionInput>
    | DesktopRunRequest<FolderAction.DISPLAY_FILES, FolderDisplayFilesActionInput>
    | DesktopRunRequest<FolderAction.CREATE, FolderCreateActionInput>
    | DesktopRunRequest<FolderAction.RENAME, FolderRenameActionInput>;
