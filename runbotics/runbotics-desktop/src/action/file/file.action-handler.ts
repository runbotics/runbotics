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
    | DesktopRunRequest<FileAction.REMOVE_FILE, FileRemoveFileActionInput>;

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
    conflict: 'Overwrite' | 'Extend name' | 'Throw Error';
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
        if(fs.existsSync(input.path)) {
            switch (input.conflict) {
                case 'Overwrite': 
                    await createNewFile(input.path);
                    return 'File overwritten successfully';
                case 'Extend name': {
                    const newFilePath = getUniqueFileName(input.path);
                    await createNewFile(newFilePath);
                    return 'File with extended name created successfully';
                }
                case 'Throw Error':
                    throw Error('File with the same name already exists');
                default: 
                    await createNewFile(input.path);
                    return 'File created successfully';
            }
        } 
        await createNewFile(input.path);
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

async function createNewFile(path: string){
    try {
        fs.closeSync(fs.openSync(`${path}`, 'a'));
    } catch (err) {
        throw Error(err);
    }
}

function getUniqueFileName(filePath) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext).replace(/\s\(\d+\)/, '');
    
    let counter = 1;
    let newFilePath = path.join(dir, `${baseName} (${counter})${ext}`);
    
    // Keep increasing counter until we find a free name
    while (fs.existsSync(newFilePath)) {
        counter++;
        newFilePath = path.join(dir, `${baseName} (${counter})${ext}`);
    }

    return newFilePath;
}