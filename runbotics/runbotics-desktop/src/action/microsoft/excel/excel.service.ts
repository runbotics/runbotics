import { Injectable } from '@nestjs/common';
import { MicrosoftPlatform } from 'runbotics-common';

import { RunboticsLogger } from '#logger';

import { CollectionResponse, MicrosoftGraphService } from '../microsoft-graph';
import { SharePointService } from '../share-point';
import {
    ExcelCellValue,
    ExcelSession,
    ExcelSessionInfo,
    SharePointSessionInfo,
    WorkbookCellCoordinates,
    Range,
    WorkbookRangeUpdateBody,
    WorkbookSessionInfo,
    Worksheet,
    SharePointFileInfo,
    OneDriveSessionInfo,
    OneDriveFileInfo,
    FileInfo,
} from './excel.types';
import { OneDriveService } from '../one-drive';
import { hasWorkbookSessionId, hasWorksheetName } from './excel.utils';
import { CloudExcelErrorMessage } from './automation/cloud-excel.error-message';

@Injectable()
export class ExcelService {
    private readonly logger = new RunboticsLogger(ExcelService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
        private readonly sharePointService: SharePointService,
        private readonly oneDriveService: OneDriveService,
    ) {}

    /**
     * @see https://learn.microsoft.com/en-us/graph/api/workbook-createsession?view=graph-rest-1.0&tabs=javascript
     */
    async createSession(fileInfo: ExcelSessionInfo): Promise<ExcelSession> {
        const session = fileInfo.platform === MicrosoftPlatform.SharePoint
            ? await this.gatherSharePointFileInfo(fileInfo)
            : await this.gatherOneDriveFileInfo(fileInfo);

        const workbookSessionInfo = await this.microsoftGraphService.post<WorkbookSessionInfo>(
            this.createWorkbookUrl(session, '/createSession'),
            {
                persistChanges: true,
            }
        );

        const worksheet = await this.getActiveWorksheet({
            ...session,
            worksheetName: fileInfo.worksheetName
        });

        return {
            ...session,
            worksheetName: worksheet.name,
            workbookSessionId: workbookSessionInfo.id,
        };
    }

    /**
     * @see https://learn.microsoft.com/en-us/graph/api/workbook-closesession?view=graph-rest-1.0&tabs=javascript
     */
    async closeSession(session: ExcelSession) {
        await this.microsoftGraphService.post(
            this.createWorkbookUrl(session, '/closeSession'),
            {},
            this.getSessionHeader(session),
        );
    }

    /**
     * @see https://learn.microsoft.com/en-us/graph/api/worksheet-cell?view=graph-rest-1.0&tabs=http
     */
    async getCell(session: ExcelSession, cellCoordinates: WorkbookCellCoordinates) {
        const url = `/worksheets/${session.worksheetName}/cell(row=${Number(cellCoordinates.row) - 1},column=${
            this.getColumnNumber(cellCoordinates.column) - 1
        })`;

        const response = await this.microsoftGraphService.get<Range>(
            this.createWorkbookUrl(session, url),
            this.getSessionHeader(session),
        );

        const cellValue: ExcelCellValue = this.isValueUnclear(response.numberFormat[0][0])
            ? response.text[0][0]
            : response.values[0][0];

        return cellValue;
    }

    /**
     * @see https://learn.microsoft.com/en-us/graph/api/worksheet-range?view=graph-rest-1.0&tabs=javascript
     */
    async getCells(session: ExcelSession, address: string): Promise<ExcelCellValue[][]> {
        const url = `/worksheets/${session.worksheetName}/range(address='${address}')`;

        const response = await this.microsoftGraphService.get<Range>(
            this.createWorkbookUrl(session, url),
            this.getSessionHeader(session),
        );

        const { values, text, numberFormat, columnCount, rowCount } = response;
        const cellValues = [];

        for (let row = 0; row < rowCount; row++) {
            const rowValues: ExcelCellValue[] = [];
            for (let column = 0; column < columnCount; column++) {
                const cellValue = this.isValueUnclear(numberFormat[row][column])
                    ? text[row][column]
                    : values[row][column];
                rowValues.push(cellValue);
            }
            cellValues.push(rowValues);
        }

        return cellValues;
    }


    /**
     * @see https://learn.microsoft.com/en-us/graph/api/range-update?view=graph-rest-1.0&tabs=javascript
     */
    setCell(session: ExcelSession, address: string, value: string) {
        const url = `/worksheets/${session.worksheetName}/range(address='${address}:${address}')`;

        const newRange: WorkbookRangeUpdateBody = {
            values: [[value]],
        };

        return this.microsoftGraphService.patch<Range>(
            this.createWorkbookUrl(session, url),
            newRange,
            this.getSessionHeader(session),
        );
    }

    /**
     * @see https://learn.microsoft.com/en-us/graph/api/range-update?view=graph-rest-1.0&tabs=javascript
     * @description {string} url requires range address in a format of column letters, e.g. "A1:C3"
     */
    setCells(session: ExcelSession, startCell: string, values: ExcelCellValue[][]) {
        if (!Array.isArray(values)) {
            values = JSON.parse(values) as ExcelCellValue[][];
        }

        if (!values.length) {
            throw new Error(CloudExcelErrorMessage.setCellsIncorrectInput());
        }
        
        const startColumnLetter = startCell.match(/[A-Z]+/).toString();
        const startColumnNumber = this.getColumnNumber(startColumnLetter);
        const startRow = +startCell.match(/\d+/);
        
        const endColumnNumber = startColumnNumber + values[0].length - 1;
        const endColumnLetter = this.getColumnLetter(endColumnNumber);
        const endRow = startRow + values.length - 1;

        const address = `${startColumnLetter}${startRow}:${endColumnLetter}${endRow}`;
        
        const url = `/worksheets/${session.worksheetName}/range(address='${address}')`;

        const newRange: WorkbookRangeUpdateBody = {
            values,
        };

        return this.microsoftGraphService.patch<Range>(
            this.createWorkbookUrl(session, url),
            newRange,
            this.getSessionHeader(session),
        );
    }

    /**
     * @see https://learn.microsoft.com/en-us/graph/api/workbook-list-worksheets?view=graph-rest-1.0&tabs=javascript
     */
    getWorksheets(session: FileInfo) {
        return this.microsoftGraphService.get<CollectionResponse<Worksheet>>(
            this.createWorkbookUrl(session, '/worksheets'),
            this.getSessionHeader(session),
        );
    }

    /**
     * @see https://learn.microsoft.com/en-us/graph/api/worksheet-get?view=graph-rest-1.0&tabs=javascript
     */
    getWorksheet(session: ExcelSession) {
        return this.microsoftGraphService
            .get<Worksheet>(
                this.createWorkbookUrl(session, `/worksheets/${session.worksheetName}`),
                this.getSessionHeader(session),
            );
    }


    /**
     * @see https://learn.microsoft.com/en-us/graph/api/worksheet-delete?view=graph-rest-1.0&tabs=http
     */
    deleteWorksheet(session: ExcelSession, worksheetName: Worksheet['name']) {
        return this.microsoftGraphService
            .delete(
                this.createWorkbookUrl(session, `/worksheets/${worksheetName}`),
                this.getSessionHeader(session),
            );
    }

    private getActiveWorksheet(session: ExcelSession | FileInfo) {
        if (hasWorksheetName(session)) {
            return this.getWorksheet(session);
        }
        return this.getWorksheets(session)
            .then(response => response.value[0]);
    }

    private createWorkbookUrl(session: ExcelSession | FileInfo, url: string) {
        switch (session.platform) {
            case MicrosoftPlatform.SharePoint:
                return `/sites/${session.siteId}/drives/${session.driveId}/items/${session.fileId}/workbook${url}`;
            case MicrosoftPlatform.OneDrive:
                return `/me/drive/items/${session.fileId}/workbook${url}`;
            default:
                throw new Error('Invalid platform');
        }
    }

    private getColumnNumber(column: string): number {
        //Calculates the column number based on the column letter
        // e.g.A = 1  AA = 27, AB = 28, etc.
        // it uses the ASCII code of the letter to calculate the number
        // e.g A = 65, B = 66, C = 67, etc.
        // so we subtract 64 from the ASCII code to get the column number
        return (column.length - 1) * 26 + (column.charCodeAt(column.length - 1) - 64);
    }

    /**
     * @description converts column number to a letter format
     * @param {number} columnNumber column number to convert
     * @returns {string} column in a letter format
     */
    private getColumnLetter(columnNumber: number): string {
        const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[(columnNumber - 1) % 26];
        return columnNumber >= 26 ? this.getColumnLetter(Math.floor(columnNumber / 26) - 1) + letter : letter;
    }

    private async gatherSharePointFileInfo(sessionInfo: SharePointSessionInfo): Promise<SharePointFileInfo> {
        const site = await this.sharePointService.getSitesByName(sessionInfo.siteName)
            .then(sites => sites.value[0]);

        if (!site) {
            throw new Error(`Site ${sessionInfo.siteName} not found`);
        }

        const drive = await this.sharePointService.getSiteDrives(site.id)
            .then(drives => drives.value
                .find(drive => drive.name === sessionInfo.listName)
            );

        if (!drive) {
            throw new Error(`
                Site ${sessionInfo.siteName} does not contain "${sessionInfo.listName}" list or "${sessionInfo.listName}" is not a list of type 'Document library'
            `);
        }

        const file = await this.sharePointService.getDriveItem(site.id, drive.id, sessionInfo.filePath);

        if (!file) {
            throw new Error('Provided file path does not exist');
        }

        return {
            platform: MicrosoftPlatform.SharePoint,
            siteId: site.id,
            driveId: drive.id,
            fileId: file.id,
        };
    }

    private async gatherOneDriveFileInfo(sessionInfo: OneDriveSessionInfo): Promise<OneDriveFileInfo> {
        const file = await this.oneDriveService.getItemByPath(sessionInfo.filePath);

        if (!file) {
            throw new Error('Provided file path does not exist');
        }

        return {
            platform: MicrosoftPlatform.OneDrive,
            fileId: file.id,
        };
    }

    private isValueUnclear(numberFormat: string) {
        return numberFormat.includes('@') || numberFormat.includes('%');
    }

    private getSessionHeader(session: ExcelSession | FileInfo) {
        if (hasWorkbookSessionId(session)) {
            return {
                headers: {
                    'workbook-session-id': session.workbookSessionId,
                },
            };
        }
    }
}
