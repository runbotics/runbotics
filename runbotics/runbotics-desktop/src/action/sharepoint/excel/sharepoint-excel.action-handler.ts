import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from 'runbotics-sdk';

import * as SharepointTypes from './types';
import { ExcelService } from '../../microsoft/excel/excel.service';

@Injectable()
export default class SharepointExcelActionHandler extends StatelessActionHandler {
    constructor(private readonly excelService: ExcelService) {
        super();
    }

    async openWorkbook(
        input: SharepointTypes.ExcelCloudOpenWorkbookActionInput
    ) {
        await this.excelService.openFile({
            platform: input.platform,
            sessionIdentifier: input.workbookPath,
            worksheetIdentifier: input.worksheet,
            persistChanges: input.persistChanges,
            site: input.site,
            list: input.list,
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
        input: SharepointTypes.ExcelCloudSetCellActionInput
    ) {
        this.excelService.setCell(input.cell, input.value);
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
            case 'excelCloud.setCell':
                return this.setCell(request.input);
            case 'sharepointExcel.updateRange':
                return this.updateRange(request.input);
            case 'sharepointExcel.closeSession':
                return this.closeSession(request.input);
            case 'excelCloud.openWorkbook':
                return this.openWorkbook(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
