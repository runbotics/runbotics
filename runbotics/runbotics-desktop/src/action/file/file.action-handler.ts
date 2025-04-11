import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { FileActionRequest, FileAppendFileActionInput, FileAppendFileActionOutput, FileCreateFileActionInput, FileCreateFileActionOutput, FileExistsActionInput, FileReadFileActionInput, FileReadFileActionOutput, FileRemoveFileActionInput, FileRemoveFileActionOutput, FileWriteFileActionInput, FileWriteFileActionOutput } from './types';
import { createNewFile, getUniqueFileName } from './file.utils';
import { ConflictFile } from 'runbotics-common';
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
                case ConflictFile.OVERWRITE: 
                    await createNewFile(input.path, true);
                    return 'File overwritten successfully';
                case ConflictFile.EXTEND_NAME: {
                    const newFilePath = getUniqueFileName(input.path);
                    await createNewFile(newFilePath);
                    return 'File with extended name created successfully';
                }
                case ConflictFile.THROW_ERROR:
                    throw Error('File with the same name already exists');
                default: 
                    throw Error('This case doesn\'t exist in the select option');
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

