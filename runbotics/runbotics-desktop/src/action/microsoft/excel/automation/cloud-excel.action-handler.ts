import { Injectable } from '@nestjs/common';
import { ActionRegex, CloudExcelAction } from 'runbotics-common';
import { StatefulActionHandler } from 'runbotics-sdk';

import { ExcelSession, ExcelSessionInfo, ExcelService } from '#action/microsoft/excel';

import * as SharepointTypes from './types';
import { CloudExcelErrorMessage } from './cloud-excel.error-message'; 

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

    updateRange(input: SharepointTypes.CloudExcelUpdateRangeActionInput) {
        return this.excelService.setRange(this.session, input.range, input.values);
    }

    deleteWorksheet(input: SharepointTypes.CloudExcelDeleteWorksheetActionInput) {
        return this.excelService.deleteWorksheet(this.session, input.worksheetName);
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
            case CloudExcelAction.UPDATE_RANGE:
                this.checkSession();
                return this.updateRange(request.input);
            case CloudExcelAction.DELETE_WORKSHEET:
                this.checkSession();
                return this.deleteWorksheet(request.input);
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
}