import { DesktopRunRequest } from 'runbotics-sdk';

export type FileActionRequest =
| DesktopRunRequest<'sharepointFile.downloadFileFromRoot', SharepointDownloadFromRootActionInput>
| DesktopRunRequest<'sharepointFile.downloadFileFromSite', SharepointDownloadFromSiteActionInput>
| DesktopRunRequest<'sharepointFile.uploadFile', SharepointUploadActionInput>
| DesktopRunRequest<'sharepointFile.createFolder', SharepointCreateFolderActionInput>
| DesktopRunRequest<'sharepointFile.getSharepointSiteConnection', SharepointSiteConnectionActionInput>
| DesktopRunRequest<'sharepointFile.downloadFiles', SharepointDownloadFilesInput>;

export type SharepointDownloadFromRootActionInput = {
    filePath: string;
    localPath: string;
};
export type SharepointDownloadFromSiteActionInput = {
    siteRelativePath: string;
    listName: string;
    folderPath: string;
    fileName: string;
    localPath: string;
};
export type SharepointDownloadActionOutput = any;

export type SharepointDownloadFilesInput = {
    siteRelativePath: string;
    listName: string;
    fieldName: string;
    fieldValue: string;
    storeDirectory: string;
};
export type SharepointDownloadFilesOutput = string[];

export type SharepointUploadActionInput = {
    siteRelativePath: string;
    listName: string;
    filePath: string;
    localPath: string;
    cloudPath: string;
};
export type SharepointUploadActionOutput = any;

export type SharepointCreateFolderActionInput = {
    siteRelativePath: string;
    listName: string;
    folderName: string;
    parentFolder: string;
    cloudPath: string;
}

export type SharepointCreateFolderActionOutput = any;

export type SharepointSiteConnectionActionInput = {
    siteRelativePath: string;
    listName: string;
};
export type SharepointSiteConnectionActionOutput = any;
