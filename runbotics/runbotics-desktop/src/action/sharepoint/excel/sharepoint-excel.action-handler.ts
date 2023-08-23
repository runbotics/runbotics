import { Injectable } from '@nestjs/common';
import { StatelessActionHandler, DesktopRunResponse } from 'runbotics-sdk';

import { MicrosoftService, CloudPath, MicrosoftSession } from '#action/microsoft';
import * as SharepointTypes from './types';
import { ExcelService } from '#action/microsoft/excel';

@Injectable()
export default class SharepointExcelActionHandler extends StatelessActionHandler {
    constructor(
        private readonly microsoftSession: MicrosoftSession,
        private readonly microsoftService: MicrosoftService,
        private readonly excelService: ExcelService
    ) {
        super();
    }

    async openFileFromSite(
        input: SharepointTypes.SharepointOpenFromSiteActionInput
    ): Promise<SharepointTypes.SharepointOpenActionOutput> {
        const cloudPath = CloudPath.SITE;
        const token = await this.microsoftSession.getToken();
        const sharepointSiteId = await this.microsoftService.getSiteIdByPath(token.token, input.siteRelativePath);
        const sharepointDriveId = await this.microsoftService.getDriveId(token.token, sharepointSiteId, input.listName);
        const sharepointFileId = await this.microsoftService.getFileIdByPath(token.token, cloudPath, input.filePath);
        const sharepointWorksheetId = await this.microsoftService.getWorksheetId(token.token, cloudPath, input.worksheetName);
        return await this.microsoftService.createSession(token.token, cloudPath, input.persistChanges);
    }

    async openFileFromRoot(
        input: SharepointTypes.SharepointOpenFromRootActionInput
    ): Promise<SharepointTypes.SharepointOpenActionOutput> {
        // const cloudPath = CloudPath.ROOT;
        const token = await this.microsoftSession.getToken();
        // const sharepointFileId = await this.microsoftService.getFileIdByPath(token.token, cloudPath, input.filePath);
        // const sharepointWorksheetId = await this.microsoftService.getWorksheetId(token.token, cloudPath, input.worksheetName);
        // return await this.microsoftService.createSession(token.token, cloudPath, input.persistChanges);
        return await this.excelService.openFile(input.filePath, input.worksheetName, token.token);
    }

    async closeSession(
        input: SharepointTypes.SharepointExcelCloseSessionActionInput
    ): Promise<SharepointTypes.SharepointExcelCloseSessionActionOutput> {
        return await this.microsoftService.closeSession();
    }

    async getCell(
        input: SharepointTypes.SharepointGetExcelCellActionInput
    ): Promise<SharepointTypes.SharepointExcelGetCellActionOutput> {
        return await this.microsoftService.getCellValue(input.cell);
    }

    async getRange(
        input: SharepointTypes.SharepointExcelGetRangeActionInput
    ): Promise<SharepointTypes.SharepointExcelGetRangeActionOutput> {
        return await this.microsoftService.getRange(input.range);
    }

    async setCell(
        input: SharepointTypes.SharepointSetExcelCellActionInput
    ): Promise<SharepointTypes.SharepointExcelSetCellActionOutput> {
        return await this.microsoftService.setCellValue(input.cell, input.content);
    }

    async updateRange(
        input: SharepointTypes.SharepointExcelUpdateRangeActionInput
    ): Promise<SharepointTypes.SharepointExcelUpdateRangeActionOutput> {
        return await this.microsoftService.updateRange(input.range, input.values);
    }

    async run(request: SharepointTypes.FileActionRequest) {
        switch (request.script) {
            case 'sharepointExcel.openFileFromSite':
                return this.openFileFromSite(request.input);
            case 'sharepointExcel.openFileFromRoot':
                return this.openFileFromRoot(request.input);
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
            default:
                throw new Error('Action not found');
        }
    }
}
