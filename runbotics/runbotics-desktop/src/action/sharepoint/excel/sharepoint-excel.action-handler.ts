import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from 'runbotics-sdk';

import * as SharepointTypes from './types';
import { ExcelService } from '../../microsoft/excel/excel.service';

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
            persistChanges: input.persistChanges,
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
    ): Promise<SharepointTypes.SharepointExcelGetCellActionOutput> {
        return this.excelService.getCell({ column: input.cell[0], row: input.cell[1] });
    }

    async getRange(
        input: SharepointTypes.SharepointExcelGetRangeActionInput
    ): Promise<SharepointTypes.SharepointExcelGetRangeActionOutput> {
        return this.excelService.getRange(input.range);
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
            case 'sharepointExcel.getRange':
                return this.getRange(request.input);
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
