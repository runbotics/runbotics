import { Injectable } from '@nestjs/common';
import { ActionCredentialType, ActionRegex, CloudExcelAction } from 'runbotics-common';
import { StatefulActionHandler } from '@runbotics/runbotics-sdk';

import { ExcelSession, ExcelSessionInfo, ExcelService } from '#action/microsoft/excel';

import * as CloudExcelTypes from './cloud-excel.types';
import { CloudExcelErrorMessage } from './cloud-excel.error-message';

import { sortNumbersDescending } from '#action/microsoft/excel/excel.utils';
import { MicrosoftCredential } from '#action/microsoft/common.types';
import { ServerConfigService } from '#config';

@Injectable()
export class CloudExcelActionHandler extends StatefulActionHandler {
    private session: ExcelSession = null;

    constructor(
        private readonly excelService: ExcelService,
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }

    async openFile(input: ExcelSessionInfo, credential: MicrosoftCredential) {
        this.session = await this.excelService.createSession(input, credential);
    }

    async closeSession() {
        if (this.session === null) return;
        await this.excelService.closeSession(this.session);
        this.session = null;
    }

    getWorksheetContent(input: CloudExcelTypes.CloudExcelGetWorksheetContentActionInput) {
        return this.excelService.getWorksheetContent(this.session, input.worksheetName);
    }

    getCell(input: CloudExcelTypes.CloudGetExcelCellActionInput) {
        const column = input.cell.match(/[A-Z]+/);
        const row = input.cell.match(/\d+/);

        if (!column || !row) {
            throw new Error(CloudExcelErrorMessage.getCellIncorrectInput());
        }

        return this.excelService.getCell(
            this.session,
            {
                column: column.toString(),
                row: row.toString()
            },
            input.isStringExpected
        );
    }

    getCells(input: CloudExcelTypes.CloudExcelGetCellsActionInput) {
        const startCell = input.startCell.match(ActionRegex.CELL_ADDRESS);
        const endCell = input.endCell.match(ActionRegex.CELL_ADDRESS);

        if (!startCell || !endCell) {
            throw new Error(CloudExcelErrorMessage.getCellsIncorrectInput());
        }

        const range = `${startCell}:${endCell}`;
        return this.excelService.getCells(this.session, range, input.isStringExpected);
    }

    setCell(input: CloudExcelTypes.CloudExcelSetCellActionInput) {
        return this.excelService.setCell(this.session, input.cell, input.value);
    }

    setCells(input: CloudExcelTypes.CloudExcelSetCellsActionInput) {
        return this.excelService.setCells(this.session, input.startCell, input.values);
    }

    createWorksheet(input: CloudExcelTypes.CloudExcelDeleteWorksheetActionInput) {
        return this.excelService.createWorksheet(this.session, input.worksheetName);
    }

    deleteWorksheet(input: CloudExcelTypes.CloudExcelDeleteWorksheetActionInput) {
        return this.excelService.deleteWorksheet(this.session, input.worksheetName);
    }

    deleteColumns(input: CloudExcelTypes.CloudExcelDeleteColumnsActionInput) {
        const startColumn = input.startColumn.match(ActionRegex.EXCEL_COLUMN_NAME);
        const endColumn = input.endColumn ? input.endColumn.match(ActionRegex.EXCEL_COLUMN_NAME) : startColumn;

        if (!startColumn || !endColumn) {
            throw new Error(CloudExcelErrorMessage.getColumnsIncorrectInput());
        }

        const columnRange = `${startColumn}:${endColumn}`;

        return this.excelService.deleteColumns(this.session, columnRange);
    }

    deleteRows(input: CloudExcelTypes.CloudExcelDeleteRowsActionInput) {
        const { rowRange, worksheet } = input;

        if (Array.isArray(rowRange)) {
            const sortedDescendingRows = sortNumbersDescending(rowRange);
            return this.deleteRowsOneByOne(this.session, sortedDescendingRows, worksheet);
        }

        if (!rowRange.toString().match(ActionRegex.EXCEL_DELETE_ROWS_INPUT)) {
            throw new Error(CloudExcelErrorMessage.deleteRowsIncorrectInput());
        }

        if (rowRange.match(ActionRegex.EXCEL_ROW_RANGE)) {
            return this.excelService.deleteRows(this.session, rowRange, worksheet);
        } else if (rowRange.match(ActionRegex.EXCEL_DELETE_ROW_INPUT)) {
            const address = `${rowRange}:${rowRange}`;
            return this.excelService.deleteRows(this.session, address, worksheet);
        } else {
            let rows: number[];
            try {
                rows = JSON.parse(rowRange);
                if (!Array.isArray(rows)) {
                    throw new Error();
                }
            } catch (e) {
                throw new Error(CloudExcelErrorMessage.deleteRowsIncorrectInput());
            }
            const sortedDescendingRows = sortNumbersDescending(rows);
            return this.deleteRowsOneByOne(this.session, sortedDescendingRows, worksheet);
        }
    }

    run(request: CloudExcelTypes.CloudExcelActionRequest) {
        switch (request.script) {
            case CloudExcelAction.OPEN_FILE:
                // @todo throw error 'incorrect action definition - credentials are needed for this action' if any of CredentialData or list including MicrosoftCredential is not present in the input

                // eslint-disable-next-line no-case-declarations
                const authData = this.serverConfigService.microsoftAuth;

                // eslint-disable-next-line no-case-declarations
                const matchedCredentials = { // @todo here method for matching credentialId (templateName) from action input to decrypted credential (default for the template), e.g.: this.credentialService.getCredentialValue(templateName: request.input.templateName, credentialId?: request.input.credentialId); -> output like mock below
                    config: {
                        auth: {
                            clientId: authData.clientId,
                            authority: authData.tenantId,
                            clientSecret: authData.clientSecret,
                        }
                    },
                    loginCredential: {
                        username: authData.username,
                        password: authData.password,
                    }
                };

                return this.openFile(request.input, matchedCredentials);
            case CloudExcelAction.GET_WORKSHEET_CONTENT:
                this.checkSession();
                return this.getWorksheetContent(request.input);
            case CloudExcelAction.GET_CELL:
                this.checkSession();
                return this.getCell(request.input);
            case CloudExcelAction.GET_CELLS:
                this.checkSession();
                return this.getCells(request.input);
            case CloudExcelAction.SET_CELL:
                this.checkSession();
                return this.setCell(request.input);
            case CloudExcelAction.SET_CELLS:
                this.checkSession();
                return this.setCells(request.input);
            case CloudExcelAction.CREATE_WORKSHEET:
                this.checkSession();
                return this.createWorksheet(request.input);
            case CloudExcelAction.DELETE_WORKSHEET:
                this.checkSession();
                return this.deleteWorksheet(request.input);
            case CloudExcelAction.DELETE_COLUMNS:
                this.checkSession();
                return this.deleteColumns(request.input);
            case CloudExcelAction.DELETE_ROWS:
                this.checkSession();
                return this.deleteRows(request.input);
            case CloudExcelAction.CLOSE_SESSION:
                return this.closeSession();
            default:
                throw new Error('Action not found');
        }
    }

    async tearDown() {
        await this.closeSession();
    }

    private checkSession() {
        if (this.session === null) {
            throw new Error('There is no Cloud Excel session. Open file before');
        }
    }

    async deleteRowsOneByOne(session: ExcelSession, array: number[], worksheet: string) {
        for (const row of array) {
            const address = `${row}:${row}`;
            await this.excelService.deleteRows(session, address, worksheet);
        }
    }
}
