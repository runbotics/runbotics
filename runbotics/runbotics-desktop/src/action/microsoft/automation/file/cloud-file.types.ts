import { CloudFileAction, MicrosoftPlatform } from 'runbotics-common';
import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { ActionCredentialData } from '#action/microsoft/common.types';

export type CloudFileActionRequest =
    | DesktopRunRequestWithCredentials<CloudFileAction.DOWNLOAD_FILE, CloudFileDownloadFileActionInput>
    | DesktopRunRequestWithCredentials<CloudFileAction.UPLOAD_FILE, CloudFileUploadFileActionInput>
    | DesktopRunRequestWithCredentials<CloudFileAction.CREATE_FOLDER, CloudFileCreateFolderActionInput>
    | DesktopRunRequestWithCredentials<CloudFileAction.MOVE_FILE, CloudFileMoveFileActionInput>
    | DesktopRunRequestWithCredentials<CloudFileAction.DELETE_ITEM, CloudFileDeleteItemActionInput>
    | DesktopRunRequestWithCredentials<CloudFileAction.CREATE_SHARE_LINK, CloudFileCreateShareLink>
    | DesktopRunRequestWithCredentials<CloudFileAction.GET_SHAREPOINT_LIST_ITEMS, SharepointGetListItems>;

type DesktopRunRequestWithCredentials<S extends string, I> = DesktopRunRequest<S, I> & ActionCredentialData;
export interface SharePointCommon {
    platform: MicrosoftPlatform.SharePoint;
    listName: string;
    siteRelativePath: string;
}

// DOWNLOAD FILE
export interface OneDriveDownloadFileActionInput {
    platform: MicrosoftPlatform.OneDrive;
    filePath?: string;
    localDirectory?: string;
}

export type SharePointDownloadFileActionInput = SharePointCommon & Omit<OneDriveDownloadFileActionInput, 'platform'>;
export type CloudFileDownloadFileActionInput = OneDriveDownloadFileActionInput | SharePointDownloadFileActionInput;

// UPLOAD FILE
export interface OneDriveUploadFileActionInput {
    platform: MicrosoftPlatform.OneDrive;
    filePath: string;
    cloudDirectoryPath: string;
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
    filePath: string;
    destinationFolderPath: string;
}

export type SharePointMoveFileActionInput = SharePointCommon & Omit<OneDriveMoveFileActionInput, 'platform'>;
export type CloudFileMoveFileActionInput = OneDriveMoveFileActionInput | SharePointMoveFileActionInput;

// DELETE ITEM
export interface OneDriveDeleteItemActionInput {
    platform: MicrosoftPlatform.OneDrive;
    itemPath: string;
}

export type SharePointDeleteItemActionInput = SharePointCommon & Omit<OneDriveDeleteItemActionInput, 'platform'>;
export type CloudFileDeleteItemActionInput = OneDriveDeleteItemActionInput | SharePointDeleteItemActionInput;

// CREATE SHARE LINK
export interface OneDriveCreateShareLink {
    platform: MicrosoftPlatform.OneDrive;
    shareType: string;
    shareScope: string;
    itemPath: string;
}

export type SharePointCreateShareLink = SharePointCommon & Omit<OneDriveCreateShareLink, 'platform'>;
export type CloudFileCreateShareLink = OneDriveCreateShareLink | SharePointCreateShareLink;

// GET SHAREPOINT LIST ITEMS
export interface SharepointGetListItems {
    platform: MicrosoftPlatform.SharePoint;
    listName: string;
    siteRelativePath: string;
}
