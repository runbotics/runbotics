import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';
import { DesktopRunRequest } from 'runbotics-sdk';

export type CloudFileActionRequest =
    | DesktopRunRequest<CloudFileAction.DOWNLOAD_FILE, CloudFileDownloadFileActionInput>
    | DesktopRunRequest<CloudFileAction.UPLOAD_FILE, CloudFileUploadFileActionInput>
    | DesktopRunRequest<CloudFileAction.CREATE_FOLDER, CloudFileCreateFolderActionInput>
    | DesktopRunRequest<CloudFileAction.MOVE_FILE, CloudFileMoveFileActionInput>;


interface SharePointCommon {
    platform: MicrosoftPlatform.SharePoint;
    listName: string;
    siteName: string;
}

// DOWNLOAD FILE
export interface OneDriveDownloadFileActionInput {
    platform: MicrosoftPlatform.OneDrive;
    fileName: string;
    parentFolderPath?: string;
    localDirectory?: string;
}

export type SharePointDownloadFileActionInput = SharePointCommon & Omit<OneDriveDownloadFileActionInput, 'platform'>;
export type CloudFileDownloadFileActionInput = OneDriveDownloadFileActionInput | SharePointDownloadFileActionInput;

// UPLOAD FILE
export interface OneDriveUploadFileActionInput {
    platform: MicrosoftPlatform.OneDrive;
    fileName: string;
    localParentFolderPath?: string;
    parentFolderPath?: string;
}

export type SharePointUploadFileActionInput = SharePointCommon & Omit<OneDriveUploadFileActionInput, 'platform'>;
export type CloudFileUploadFileActionInput = OneDriveUploadFileActionInput | SharePointUploadFileActionInput;

// CREATE FOLDER
export interface OneDriveCreateFolderActionInput {
    platform: MicrosoftPlatform.OneDrive;
    folderName: string;
    parentFolderPath?: string;
}

export type SharePointCreateFolderActionInput = SharePointCommon & Omit<OneDriveCreateFolderActionInput, 'platform'>;
export type CloudFileCreateFolderActionInput = OneDriveCreateFolderActionInput | SharePointCreateFolderActionInput;

// MOVE FILE
export interface OneDriveMoveFileActionInput {
    platform: MicrosoftPlatform.OneDrive;
    fileName: string;
    destinationFolderPath: string;
    parentFolderPath?: string;
}

export type SharePointMoveFileActionInput = SharePointCommon & Omit<OneDriveMoveFileActionInput, 'platform'>;
export type CloudFileMoveFileActionInput = OneDriveMoveFileActionInput | SharePointMoveFileActionInput;