import { Injectable } from '@nestjs/common';
import { StatelessActionHandler, DesktopRunRequest, DesktopRunResponse } from '@runbotics/runbotics-sdk';
import csv from 'csvtojson/v2';

export type ImportActionRequest =
| DesktopRunRequest<'import.csv', ImportCSVActionInput>;

export type ImportCSVActionInput = {
    file: string;
};
export type ImportCSVActionOutput = any;

@Injectable()
export default class ImportActionHandler extends StatelessActionHandler {
    async importCSV(input: ImportCSVActionInput): Promise<ImportCSVActionOutput> {
        const array = input.file.split(';');
        const decoded = Buffer.from(array[2].split(',')[1], 'base64').toString('utf-8');
        const result = await csv({
            delimiter: [';'],
        }).fromString(decoded);

        return result;
    }

    run(request: ImportActionRequest) {
        switch (request.script) {
            case 'import.csv':
                return this.importCSV(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
