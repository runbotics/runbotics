import { Injectable } from '@nestjs/common';
import { StatefulActionHandler, StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import csv from 'csvtojson/v2';

export type ImportActionRequest<I> = DesktopRunRequest<any> & {
    script: 'import.csv';
};

export type ImportCSVActionInput = {
    file: string;
};
export type ImportCSVActionOutput = any;

@Injectable()
export class ImportActionHandler extends StatelessActionHandler {
    async importCSV(input: ImportCSVActionInput): Promise<ImportCSVActionOutput> {
        const array = input.file.split(';');
        const decoded = Buffer.from(array[2].split(',')[1], 'base64').toString('utf-8');
        const result = await csv({
            delimiter: [';'],
        }).fromString(decoded);

        return result;
    }

    async run(request: ImportActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'import.csv':
                output = await this.importCSV(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}
