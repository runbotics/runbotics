import { StatelessActionHandler, DesktopRunRequest } from 'runbotics-sdk';
import fs from 'fs';
import { Injectable } from '@nestjs/common';

export type FileActionRequest =
| DesktopRunRequest<'file.writeFile', FileWriteFileActionInput>
| DesktopRunRequest<'file.readFile', FileReadFileActionInput>
| DesktopRunRequest<'file.appendFile', FileAppendFileActionInput>
| DesktopRunRequest<'file.createFile', FileCreateFileActionInput>
| DesktopRunRequest<'file.removeFile', FileRemoveFileActionInput>;

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
            default:
                throw new Error('Action not found');
        }
    }
}
