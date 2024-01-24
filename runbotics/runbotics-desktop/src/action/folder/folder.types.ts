import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { FolderAction } from 'runbotics-common';

export type FolderDeleteActionInput = {
    name: string;
    recursive: boolean;
    path?: string;
};

export type FolderActionRequest =
    | DesktopRunRequest<FolderAction.DELETE, FolderDeleteActionInput>;