import { StatelessActionHandler, DesktopRunRequest } from '@runbotics/runbotics-sdk';
import fs from 'fs';
import parse from 'csv-parser';
import { Injectable } from '@nestjs/common';

import { RunboticsLogger } from '#logger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// ----
export type WriteFileActionInput = {
    path: string;
    separator: string;
};
export type WriteFileActionOutput = any;

export interface ReadFileActionInput {
    path: string;
    separator: string;
}

export interface AppendFileActionInput {
    path: string;
    content: string;
}

export type CsvActionRequest =
| DesktopRunRequest<'csv.writeFile', WriteFileActionInput>
| DesktopRunRequest<'csv.readFile', ReadFileActionInput>
| DesktopRunRequest<'csv.appendFile', AppendFileActionInput>;

@Injectable()
export default class CsvActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(CsvActionHandler.name);

    constructor() {
        super();
    }

    async appendFile(input: AppendFileActionInput): Promise<WriteFileActionOutput> {
        const ws = fs.createWriteStream('accounts.csv', { flags: 'a' });
        const csvWriter = createCsvWriter({
            path: input.path,
            header: [
                { id: 'name', title: 'NAME' },
                { id: 'lang', title: 'LANGUAGE' },
            ],
            fieldDelimiter: ';',
            append: true,
        });

        // TODO: cleanup
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

    async writeFile(input: WriteFileActionInput): Promise<WriteFileActionOutput> {
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

    async readFile(input: ReadFileActionInput): Promise<WriteFileActionOutput> {
        const results = [];
        fs.createReadStream(input.path)
            .pipe(parse({ separator: input.separator }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                this.logger.log(results);
            });
        return results;
    }

    run(request: CsvActionRequest) {
        switch (request.script) {
            case 'csv.appendFile':
                return this.appendFile(request.input);
            case 'csv.readFile':
                return this.readFile(request.input);
            case 'csv.writeFile':
                return this.writeFile(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
