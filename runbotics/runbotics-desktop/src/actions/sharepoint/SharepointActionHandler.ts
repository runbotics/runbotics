import { StatefulActionHandler, StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';

import { Injectable } from '@nestjs/common';
import { MicrosoftSession } from '../microsoft/microsoft.session';
import { MicrosoftService, CloudPath } from '../microsoft/microsoft.service';

// ----
export type SharepointOpenFromRootActionInput = {
    filePath: string;
    worksheetName: string;
    persistChanges: boolean;
};
export type SharepointOpenFromSiteActionInput = {
    siteName: string;
    listName: string;
    fileName: string;
    worksheetName: string;
    persistChanges: boolean;
};
export type SharepointOpenActionOutput = any;

// ----
export type SharepointSetExcelCellActionInput = {
    content: string;
    cell: string;
};
export type SharepointExcelSetCellActionOutput = any;

// ----
export type SharepointExcelUpdateRangeActionInput = {
    range: string;
    values: any[][];
};
export type SharepointExcelUpdateRangeActionOutput = any;

// ----
export type SharepointGetExcelCellActionInput = {
    cell: string;
};
export type SharepointExcelGetCellActionOutput = any;

export type SharepointExcelGetRangeActionInput = {
    range: string;
};
export type SharepointExcelGetRangeActionOutput = any;

export type FileActionRequest<I> = DesktopRunRequest<any> & {
    script:
        | 'sharepointExcel.setCell'
        | 'sharepointExcel.getCell'
        | 'sharepointExcel.openFileFromSite'
        | 'sharepointExcel.openFileFromRoot'
        | 'sharepointExcel.updateRange'
        | 'sharepointExcel.getRange';
};

@Injectable()
export class SharepointExcelActionHandler extends StatelessActionHandler {
    constructor(
        private readonly microsoftSession: MicrosoftSession,
        private readonly microsoftService: MicrosoftService,
    ) {
        super();
    }

    async openFileFromSite(input: SharepointOpenFromSiteActionInput): Promise<SharepointOpenActionOutput> {
        const cloudPath = CloudPath.Site;
        const token = await this.microsoftSession.getToken();
        const siteId = await this.microsoftService.getSiteIdBySearch(token.token, input.siteName);
        await this.microsoftService.getDriveId(token.token, siteId, input.listName);
        await this.microsoftService.getFileIdBySearch(token.token, cloudPath, input.fileName);
        await this.microsoftService.getWorksheetId(token.token, cloudPath, input.worksheetName);
        return await this.microsoftService.createSession(token.token, cloudPath, input.persistChanges);
    }

    async openFileFromRoot(input: SharepointOpenFromRootActionInput): Promise<SharepointOpenActionOutput> {
        const cloudPath = CloudPath.Root;
        const token = await this.microsoftSession.getToken();
        await this.microsoftService.getRootFileIdByPath(token.token, input.filePath);
        await this.microsoftService.getWorksheetId(token.token, cloudPath, input.worksheetName);
        return await this.microsoftService.createSession(token.token, cloudPath, input.persistChanges);
    }

    async getCell(input: SharepointGetExcelCellActionInput): Promise<SharepointExcelGetCellActionOutput> {
        return await this.microsoftService.getCellValue(input.cell);
    }

    async getRange(input: SharepointExcelGetRangeActionInput): Promise<SharepointExcelGetRangeActionOutput> {
        return await this.microsoftService.getRange(input.range);
    }

    async setCell(input: SharepointSetExcelCellActionInput): Promise<SharepointExcelSetCellActionOutput> {
        return await this.microsoftService.setCellValue(input.cell, input.content);
    }

    async updateRange(input: SharepointExcelUpdateRangeActionInput): Promise<SharepointExcelUpdateRangeActionOutput> {
        return await this.microsoftService.updateRange(input.range, input.values);
    }

    async run(request: FileActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'sharepointExcel.openFileFromSite':
                output = await this.openFileFromSite(request.input);
                break;
            case 'sharepointExcel.openFileFromRoot':
                output = await this.openFileFromRoot(request.input);
                break;
            case 'sharepointExcel.getCell':
                output = await this.getCell(request.input);
                break;
            case 'sharepointExcel.getRange':
                output = await this.getRange(request.input);
                break;
            case 'sharepointExcel.setCell':
                output = await this.setCell(request.input);
                break;
            case 'sharepointExcel.updateRange':
                output = await this.updateRange(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}
