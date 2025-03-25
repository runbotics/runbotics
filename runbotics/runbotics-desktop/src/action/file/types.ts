import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { ConflictFile, FileAction } from 'runbotics-common';

export type FileActionRequest =
    | DesktopRunRequest<FileAction.WRITE_FILE, FileWriteFileActionInput>
    | DesktopRunRequest<FileAction.READ_FILE, FileReadFileActionInput>
    | DesktopRunRequest<FileAction.APPEND_FILE, FileAppendFileActionInput>
    | DesktopRunRequest<FileAction.CREATE_FILE, FileCreateFileActionInput>
    | DesktopRunRequest<FileAction.REMOVE_FILE, FileRemoveFileActionInput>;

export type FileAppendFileActionInput = {
    content: string;
    path: string;
    separator: string;
};
export type FileAppendFileActionOutput = any;

export type FileCreateFileActionInput = {
    path: string;
    conflict: ConflictFile;
};
export type FileCreateFileActionOutput = any;

export type FileRemoveFileActionInput = {
    path: string;
};
export type FileRemoveFileActionOutput = any;

export type FileReadFileActionInput = {
    path: string;
};
export type FileReadFileActionOutput = any;

export type FileWriteFileActionInput = {
    path: string;
    content: string;
};
export type FileWriteFileActionOutput = any;

