import { Injectable } from '@nestjs/common';
import { ActionRegex, CloudExcelAction } from 'runbotics-common';
import { StatefulActionHandler } from 'runbotics-sdk';

import { ExcelSession, ExcelSessionInfo, ExcelService } from '#action/microsoft/excel';

import * as SharepointTypes from './types';
import { CloudExcelErrorMessage } from './cloud-excel.error-message';

import { sortNumbersDescending } from '../excel.utils';

@Injectable()
export class CloudExcelActionHandler extends StatefulActionHandler {
    private session: ExcelSession = null;

    constructor(private readonly excelService: ExcelService) {
        super();
    }

    async openFile(input: ExcelSessionInfo) {
        this.session = await this.excelService.createSession(input);
    }

    async closeSession() {
        if (this.session === null) return;
        await this.excelService.closeSession(this.session);
        this.session = null;
    }

    getCell(input: SharepointTypes.CloudGetExcelCellActionInput) {
        const column = input.cell.match(/[A-Z]+/);
        const row = input.cell.match(/\d+/);

        if (!column || !row) {
            throw new Error(CloudExcelErrorMessage.getCellIncorrectInput());
        }

        return this.excelService.getCell(this.session, {
            column: column.toString(),
            row: row.toString()
        });
    }

    getCells(input: SharepointTypes.CloudExcelGetCellsActionInput) {
        const startCell = input.startCell.match(ActionRegex.EXCEL_CELL_ADDRESS);
        const endCell = input.endCell.match(ActionRegex.EXCEL_CELL_ADDRESS);

        if (!startCell || !endCell) {
            throw new Error(CloudExcelErrorMessage.getCellsIncorrectInput());
        }

        const range = `${startCell}:${endCell}`;
        return this.excelService.getCells(this.session, range);
    }

    setCell(input: SharepointTypes.CloudExcelSetCellActionInput) {
        return this.excelService.setCell(this.session, input.cell, input.content);
    }

    setCells(input: SharepointTypes.CloudExcelSetCellsActionInput) {
        return this.excelService.setCells(this.session, input.startCell, input.values);
    }

    createWorksheet(input: SharepointTypes.CloudExcelDeleteWorksheetActionInput) {
        return this.excelService.createWorksheet(this.session, input.worksheetName);
    }

    deleteWorksheet(input: SharepointTypes.CloudExcelDeleteWorksheetActionInput) {
        return this.excelService.deleteWorksheet(this.session, input.worksheetName);
    }

    deleteColumns(input: SharepointTypes.CloudExcelDeleteColumnsActionInput) {
        const startColumn = input.startColumn.match(ActionRegex.EXCEL_COLUMN_NAME);
        const endColumn = input.endColumn ? input.endColumn.match(ActionRegex.EXCEL_COLUMN_NAME) : startColumn;

        if (!startColumn || !endColumn) {
            throw new Error(CloudExcelErrorMessage.getColumnsIncorrectInput());
        }

        const columnRange = `${startColumn}:${endColumn}`;

        return this.excelService.deleteColumns(this.session, columnRange);
    }

    deleteRows(input: SharepointTypes.CloudExcelDeleteRowsActionInput) {
        const rowRange = input.rowRange;
        const worksheet = input.worksheet ? input.worksheet : null;

        if (Array.isArray(rowRange)) {
            const sortedDescendingRows = sortNumbersDescending(rowRange);
            return this.deleteRowsOneByOne(this.session, sortedDescendingRows, worksheet);
        } else if (!rowRange.match(ActionRegex.EXCEL_DELETE_ROWS_INPUT)) {
            throw new Error(CloudExcelErrorMessage.deleteRowsIncorrectInput());
        } else if (rowRange.match(ActionRegex.EXCEL_ROW_RANGE)) {
            const [startRow, endRow] = rowRange.split(':');
            const address = `${startRow}:${endRow}`;
            return this.excelService.deleteRows(this.session, address, worksheet);
        } else if (rowRange.match(ActionRegex.EXCEL_ROW_NUMBER)) {
            const address = `${rowRange}:${rowRange}`;
            return this.excelService.deleteRows(this.session, address, worksheet);
        } else {
            let rows: (string | number)[];
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

    run(request: SharepointTypes.CloudExcelActionRequest) {
        switch (request.script) {
            case CloudExcelAction.OPEN_FILE:
                return this.openFile(request.input);
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
            try {
                await this.excelService.deleteRows(session, address, worksheet);
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}
