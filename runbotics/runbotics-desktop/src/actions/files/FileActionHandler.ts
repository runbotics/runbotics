import { StatefulActionHandler, StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
const fs = require('fs');

import { Injectable } from '@nestjs/common';

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

export type FileActionRequest<I> = DesktopRunRequest<any> & {
    script: 'file.writeFile' | 'file.readFile' | 'file.appendFile' | 'file.createFile' | 'file.removeFile';
};

@Injectable()
export class FileActionHandler extends StatelessActionHandler {
    constructor() {
        super();
    }

    async appendFile(input: FileAppendFileActionInput): Promise<FileAppendFileActionOutput> {
        try {
            fs.appendFileSync(input.path, input.separator ?? '' + input.content);
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

    async run(request: FileActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'file.writeFile':
                output = await this.writeFile(request.input);
                break;
            case 'file.readFile':
                output = await this.readFile(request.input);
                break;
            case 'file.appendFile':
                output = await this.appendFile(request.input);
                break;
            case 'file.createFile':
                output = await this.createFile(request.input);
                break;
            case 'file.removeFile':
                output = await this.removeFile(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}
