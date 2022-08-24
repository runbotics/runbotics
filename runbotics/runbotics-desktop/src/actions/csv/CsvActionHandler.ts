import { StatefulActionHandler, StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
const fs = require('fs');
const parse = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '../../logger/RunboticsLogger';

// ----
export type FileWriteFileActionInput = {
    path: string;
    content: string;
};
export type FileWriteFileActionOutput = any;

export type CsvActionRequest<I> = DesktopRunRequest<any> & {
    script: 'csv.writeFile' | 'csv.readFile' | 'csv.appendFile';
};

@Injectable()
export class CsvActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(CsvActionHandler.name);

    constructor() {
        super();
    }

    async appendFile(input: any): Promise<FileWriteFileActionOutput> {
        let ws = fs.createWriteStream('accounts.csv', { flag: 'a' });
        const csvWriter = createCsvWriter({
            path: input.path,
            header: [
                { id: 'name', title: 'NAME' },
                { id: 'lang', title: 'LANGUAGE' },
            ],
            fieldDelimiter: ';',
            append: true,
        });

        const records = [
            { name: 'Bob', lang: 'French, English' },
            { name: 'Mary', lang: 'English' },
        ];

        this.logger.log(input.content);
        // const records = input.content

        csvWriter.writeRecords(records).then(() => {
            this.logger.log('...Done');
        });

        return 'File saved successfully';
    }

    async writeFile(input: any): Promise<FileWriteFileActionOutput> {
        const csvWriter = createCsvWriter({
            path: input.path,
            header: [
                { id: 'name', title: 'NAME' },
                { id: 'lang', title: 'LANGUAGE' },
            ],
            fieldDelimiter: input.separator,
        });

        const records = [
            { name: 'Bob', lang: 'French, English' },
            { name: 'Mary', lang: 'English' },
        ];

        csvWriter.writeRecords(records).then(() => {
            this.logger.log('...Done');
        });

        return 'File saved successfully';
    }

    async readFile(input: any): Promise<FileWriteFileActionOutput> {
        const results = [];
        fs.createReadStream(input.path)
            .pipe(parse({ separator: input.separator }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                this.logger.log(results);
            });
        return results;
    }

    async run(request: CsvActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'csv.appendFile':
                output = await this.appendFile(request.input);
                break;
            case 'csv.readFile':
                output = await this.readFile(request.input);
                break;
            case 'csv.writeFile':
                output = await this.writeFile(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}
