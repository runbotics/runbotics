import { StatelessActionHandler, DesktopRunRequest } from '@runbotics/runbotics-sdk';
import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { FileAction } from 'runbotics-common';

export type FileActionRequest =
    | DesktopRunRequest<FileAction.WRITE_FILE, FileWriteFileActionInput>
    | DesktopRunRequest<FileAction.READ_FILE, FileReadFileActionInput>
    | DesktopRunRequest<FileAction.APPEND_FILE, FileAppendFileActionInput>
    | DesktopRunRequest<FileAction.CREATE_FILE, FileCreateFileActionInput>
    | DesktopRunRequest<FileAction.REMOVE_FILE, FileRemoveFileActionInput>
    | DesktopRunRequest<FileAction.EXISTS, FileExistsActionInput>;

// ----
export type FileAppendFileActionInput = {
    content: string;
    path: string;
    separator: string;
};
export type FileAppendFileActionOutput = any;

// ----
export type FileCreateFileActionInput = {
    path: string;
    // fileName: string;
};
export type FileCreateFileActionOutput = any;

// ----
export type FileRemoveFileActionInput = {
    path: string;
};
export type FileRemoveFileActionOutput = any;

// ----
export type FileReadFileActionInput = {
    path: string;
};
export type FileReadFileActionOutput = any;

// ----
export type FileWriteFileActionInput = {
    path: string;
    content: string;
};
export type FileWriteFileActionOutput = any;

export type FileExistsActionInput = {
    name: string;
    path?: string;
};


@Injectable()
export default class FileActionHandler extends StatelessActionHandler {
    constructor() {
        super();
    }

    async appendFile(input: FileAppendFileActionInput): Promise<FileAppendFileActionOutput> {
        try {
            fs.appendFileSync(input.path, input.content + (input.separator ?? '\n'));
        } catch (err) {
            throw Error(err);
        }
        return 'Content added successfully';
    }

    async createFile(input: FileCreateFileActionInput): Promise<FileCreateFileActionOutput> {
        try {
            fs.closeSync(fs.openSync(`${input.path}`, 'a'));
        } catch (err) {
            throw Error(err);
        }
        return 'File created successfully';
    }

    async removeFile(input: FileRemoveFileActionInput): Promise<FileRemoveFileActionOutput> {
        try {
            fs.unlinkSync(input.path);
        } catch (err) {
            throw Error(err);
        }
        return 'File removed successfully';
    }

    async readFile(input: FileReadFileActionInput): Promise<FileReadFileActionOutput> {
        let content = null;
        try {
            content = fs.readFileSync(input.path, 'utf8');
        } catch (err) {
            throw Error(err);
        }
        return content;
    }

    async writeFile(input: FileWriteFileActionInput): Promise<FileWriteFileActionOutput> {
        try {
            fs.writeFileSync(input.path, input.content);
        } catch (err) {
            throw Error(err);
        }
        return 'File saved successfully';
    }

    async existsFile(input: FileExistsActionInput) {

        if (!input.name) {
            throw new Error('Name is not provided.');
        }

        if (input.path && !fs.existsSync(input.path)) {
            throw new Error('Provided path does not exist.');
        }

        const filePath = path.join(input.path, input.name);

        return fs.existsSync(filePath);
    }

    run(request: FileActionRequest) {
        switch (request.script) {
            case 'file.writeFile':
                return this.writeFile(request.input);
            case 'file.readFile':
                return this.readFile(request.input);
            case 'file.appendFile':
                return this.appendFile(request.input);
            case 'file.createFile':
                return this.createFile(request.input);
            case 'file.removeFile':
                return this.removeFile(request.input);
            case 'file.exists':
                return this.existsFile(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
