import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { google, sheets_v4 } from 'googleapis';
import Schema$ValueRange = sheets_v4.Schema$ValueRange;
import { ServerConfigService } from '#config';
import { RunboticsLogger } from '#logger';
import {
    GoogleActionRequest,
    GoogleSheetGetCellsActionInput,
    GoogleSheetGetWorksheetActionInput,
    GoogleSheetWriteActionInput,
    GoogleSheetGetCellsByValueActionInput,
    GoogleSheetGetCellActionInput,
} from './google.types';
import { GoogleAction } from 'runbotics-common';
import {
    getCellsByValueInputSchema,
    getCellInputSchema,
    getCellsInputSchema,
    getWorksheetInputSchema,
    setCellsInputSchema,
    getCellCoordinatesByValue,
} from './google.utils';
import { ZodError } from 'zod';
import { formatZodError } from '#utils/zodError';

/**
 * @see https://developers.google.com/sheets/api/guides/concepts
 */
@Injectable()
export default class GoogleActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(GoogleActionHandler.name);

    constructor(private readonly serverConfigService: ServerConfigService) {
        super();
    }

    async getWorksheet(rawInput: GoogleSheetGetWorksheetActionInput) {
        const { spreadsheetId, sheet } = await getWorksheetInputSchema
            .parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        const sheets = this.getGoogleSheets();

        const defaultSheet = await this.getDefaultSheet(spreadsheetId);

        const { data: sheetData } = await sheets.spreadsheets.values.get({
            // https://developers.google.com/sheets/api/guides/concepts#expandable-1
            range: sheet ? sheet.split('!')[0] : defaultSheet,
            spreadsheetId,
        });

        return this.mapValueRange(sheetData);
    }

    async getCell(rawInput: GoogleSheetGetCellActionInput) {
        const { spreadsheetId, cell, sheet } = await getCellInputSchema
            .parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        const sheets = this.getGoogleSheets();

        const defaultSheet = await this.getDefaultSheet(spreadsheetId);

        const { data: sheetData } = await sheets.spreadsheets.values.get({
            // https://developers.google.com/sheets/api/guides/concepts#expandable-1
            range: `${sheet ? sheet.split('!')[0] : defaultSheet}!${cell.split(':')[0]}`,
            spreadsheetId,
        });

        return this.mapValueRange(sheetData);
    }

    async getCells(rawInput: GoogleSheetGetCellsActionInput) {
        const { spreadsheetId, range, sheet } = await getCellsInputSchema
            .parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        const sheets = this.getGoogleSheets();

        const defaultSheet = await this.getDefaultSheet(spreadsheetId);

        const { data: sheetData } = await sheets.spreadsheets.values.get({
            // https://developers.google.com/sheets/api/guides/concepts#expandable-1
            range: `${sheet ? sheet.split('!')[0] : defaultSheet}!${range}`,
            spreadsheetId,
        });

        return this.mapValueRange(sheetData);
    }

    async getCellsByValue(rawInput: GoogleSheetGetCellsByValueActionInput) {
        const { spreadsheetId, value, sheet } = await getCellsByValueInputSchema
            .parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        const sheets = this.getGoogleSheets();

        const defaultSheet = await this.getDefaultSheet(spreadsheetId);

        const { data: sheetData } = await sheets.spreadsheets.values.get({
            // https://developers.google.com/sheets/api/guides/concepts#expandable-1
            range: sheet ? sheet.split('!')[0] : defaultSheet,
            spreadsheetId,
        });

        return getCellCoordinatesByValue(value, sheetData?.values);
    }

    async setCells(rawInput: GoogleSheetWriteActionInput) {
        const { spreadsheetId, range, values, sheet } =
            await setCellsInputSchema
                .parseAsync(rawInput)
                .catch((error: ZodError) => {
                    throw formatZodError(error);
                });

        const sheets = this.getGoogleSheets();

        const defaultSheet = await this.getDefaultSheet(spreadsheetId);

        const { data: updatedSheetData } =
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheet ? sheet.split('!')[0] : defaultSheet}!${range}`,
                valueInputOption: 'USER_ENTERED',
                includeValuesInResponse: true,
                requestBody: {
                    values: this.inputArrayParser(values),
                },
            });

        return updatedSheetData;
    }

    run(request: GoogleActionRequest) {
        switch (request.script) {
            case GoogleAction.SHEETS_GET_WORKSHEET:
                return this.getWorksheet(request.input);
            case GoogleAction.SHEETS_GET_CELL:
                return this.getCell(request.input);
            case GoogleAction.SHEETS_GET_CELLS:
                return this.getCells(request.input);
            case GoogleAction.SHEETS_GET_CELL_BY_VALUE:
                return this.getCellsByValue(request.input);
            case GoogleAction.SHEETS_SET_CELLS:
                return this.setCells(request.input);
            default:
                throw new Error('Action not found');
        }
    }

    private getGoogleSheets() {
        const auth = new google.auth.JWT({
            email: this.serverConfigService.googleAuth.serviceAccountEmail,
            key: this.serverConfigService.googleAuth.privateKey,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return google.sheets({ version: 'v4', auth });
    }

    private async getDefaultSheet(spreadsheetId: string) {
        const sheets = this.getGoogleSheets();

        const { data: spreadsheet } = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        return spreadsheet.sheets[0].properties.title;
    }

    private mapValueRange(data: Schema$ValueRange) {
        if (data && 'values' in data) {
            return data;
        }

        return {
            ...data,
            values: [],
        };
    }
    private inputArrayParser(values: unknown[][] | string): unknown[][] {
        if (!values) return [];

        if (Array.isArray(values)) {
            return values;
        }

        return JSON.parse(values);
    }
}
