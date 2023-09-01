import { DesktopRunRequest } from 'runbotics-sdk';
import { MicrosoftCloudPlatform } from 'runbotics-common';

export type FileActionRequest =
| DesktopRunRequest<'microsoftFile.uploadFile', MicrosoftFileUploadInput>;

export type MicrosoftFileUploadInput = {
    platform: MicrosoftCloudPlatform;
    siteName?: string;
    listName?: string;
    cloudFilePath: string;
    localFilePath: string;
}

export const CONTENT_TYPES = [
    {
        key: '.docx',
        value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    { 
        key: '.xlsx', 
        value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    },
    { 
        key: '.pptx', 
        value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
    },
    { 
        key: '.xlsm', 
        value: 'application/vnd.ms-excel.sheet.macroEnabled.12' 
    },
    { 
        key: '.pdf', 
        value: 'application/pdf' 
    },
    { 
        key: '.txt', 
        value: 'text/plain' 
    },
];