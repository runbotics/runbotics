import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from 'runbotics-sdk';

import * as SharepointTypes from './types';
import { ExcelService } from '../../microsoft/excel/excel.service';
import SharePointExcelErrorMessage from './sharepointExcelErrorMessages'; 
import { ExcelCellValue } from '#action/microsoft/excel/excel.types';
import { RegexPattern } from '../../../../../runbotics-orchestrator-ui/src/src-app/Actions/types';

@Injectable()
export default class SharepointExcelActionHandler extends StatelessActionHandler {
    constructor(private readonly excelService: ExcelService) {
        super();
    }

    async openFile(
        input: SharepointTypes.SharepointExcelOpenFileActionInput
    ): Promise<SharepointTypes.SharepointOpenActionOutput> {
        return await this.excelService.openFile({
            platform: input.platform,
            sessionIdentifier: input.filePath,
            worksheetIdentifier: input.worksheetName,
            siteRelativePath: input.siteName,
            list: input.listName,
        });
    }

    async closeSession(
        input: SharepointTypes.SharepointExcelCloseSessionActionInput
    ): Promise<SharepointTypes.SharepointExcelCloseSessionActionOutput> {
        return this.excelService.closeSession();
    }

    async getCell(
        input: SharepointTypes.SharepointGetExcelCellActionInput
    ): Promise<ExcelCellValue> {
        const column = input.cell.match(/[A-Z]+/);
        const row = input.cell.match(/\d+/);

        if (!column || !row) {
            throw new Error(SharePointExcelErrorMessage.getCellIncorrectInput());
        }

        const cellValue = await this.excelService.getCell({
            column: column.toString(),
            row: row.toString()
        });

        return cellValue;
    }

    async getCells(
        input: SharepointTypes.SharepointExcelGetCellsActionInput
    ): Promise<ExcelCellValue[][]> {
        const startCell = input.startCell.match(RegexPattern.EXCEL_CELL_ADDRESS);
        const endCell = input.endCell.match(RegexPattern.EXCEL_CELL_ADDRESS);

        if (!startCell || !endCell) {
            throw new Error(SharePointExcelErrorMessage.getCellsIncorrectInput());
        }

        const range = `${startCell}:${endCell}`;
        const cellValues = await this.excelService.getCells(range);

        return cellValues;
    }

    async setCell(
        input: SharepointTypes.SharepointSetExcelCellActionInput
    ): Promise<SharepointTypes.SharepointExcelSetCellActionOutput> {
        return this.excelService.setCell(input.cell, input.content);
    }

    async updateRange(
        input: SharepointTypes.SharepointExcelUpdateRangeActionInput
    ): Promise<SharepointTypes.SharepointExcelUpdateRangeActionOutput> {
        return this.excelService.setRange(input.range, input.values);
    }

    async run(request: SharepointTypes.FileActionRequest) {
        switch (request.script) {
            case 'sharepointExcel.getCell':
                return this.getCell(request.input);
            case 'sharepointExcel.getCells':
                return this.getCells(request.input);
            case 'sharepointExcel.setCell':
                return this.setCell(request.input);
            case 'sharepointExcel.updateRange':
                return this.updateRange(request.input);
            case 'sharepointExcel.closeSession':
                return this.closeSession(request.input);
            case 'sharepointExcel.openFile':
                return this.openFile(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
