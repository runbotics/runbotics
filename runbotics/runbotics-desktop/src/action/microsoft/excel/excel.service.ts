import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';
import {
    Drive,
    DriveItem,
    ExcelCellValue,
    Platform,
    Session,
    SessionIdentifier,
    SessionInput,
    SharePointSessionInput,
    Site, 
    WorkbookCellCoordinates,
    WorkbookRange,
    WorkbookRangeUpdateBody,
    WorkbookSessionInfo,
    Worksheet,
    WorksheetIdentifier,
} from './excel.types';

import { ONE_DRIVE, SHARE_POINT } from 'runbotics-common';

@Injectable()
export class ExcelService {
    private readonly logger = new RunboticsLogger(ExcelService.name);

    session: Session = null;

    constructor(private readonly microsoftGraphService: MicrosoftGraphService) {}

    // https://learn.microsoft.com/en-us/graph/api/workbook-createsession?view=graph-rest-1.0&tabs=http
    public async openFile(input: SessionInput): Promise<WorkbookSessionInfo> {
        const url = '/createSession';

        this.session =
            input.platform === SHARE_POINT
                ? await this.createSharePointSession(input)
                : this.createOneDriveSession(input.platform, input.sessionIdentifier, input.worksheetIdentifier);

        if (!input.worksheetIdentifier) {
            this.session.worksheetIdentifier = await this.getDefaultWorksheetIdentifier();
        }

        const workbookSessionInfo: WorkbookSessionInfo = await this.microsoftGraphService.post(
            this.createWorkbookUrl(url),
            {
                persistChanges: true,
            }
        );

        this.session = {
            ...this.session,
            workbookSessionInfo,
        };

        return workbookSessionInfo;
    }
    //https://learn.microsoft.com/en-us/graph/api/workbook-closesession?view=graph-rest-1.0&tabs=http
    public closeSession(): Promise<void> {
        const url = '/closeSession';

        return this.microsoftGraphService.post(
            this.createWorkbookUrl(url),
            {},
            {
                headers: {
                    'workbook-session-id': this.session.workbookSessionInfo.id,
                },
            }
        );
    }
    // https://learn.microsoft.com/en-us/graph/api/worksheet-cell?view=graph-rest-1.0&tabs=http
    async getCell(cellCoordinates: WorkbookCellCoordinates): Promise<ExcelCellValue> {
        const url = `/worksheets/${this.session.worksheetIdentifier}/cell(row=${Number(cellCoordinates.row) - 1},column=${
            this.getColumnNumber(cellCoordinates.column) - 1
        })`;

        const response = await this.microsoftGraphService.get<WorkbookRange>(this.createWorkbookUrl(url), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id
            }
        });

        const cellValue: ExcelCellValue = this.isValueUnclear(response.numberFormat[0][0]) 
            ? response.text[0][0] 
            : response.values[0][0];
        
        return cellValue;
    }

    // https://learn.microsoft.com/en-us/graph/api/worksheet-range?view=graph-rest-1.0&tabs=http
    async getCells(address: string): Promise<ExcelCellValue[][]> {
        const url = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}')`;

        const response = await this.microsoftGraphService.get<WorkbookRange>(this.createWorkbookUrl(url), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });

        const { values, text, numberFormat, columnCount, rowCount, rowIndex} = response;
        const cellValues = [];

        for (let row = rowIndex; row < rowCount; row++) {
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

    // https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http
    public setCell(address: string, value: string): Promise<WorkbookRange> {
        const url = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}:${address}')`;

        const newRange: WorkbookRangeUpdateBody = {
            values: [[value]],
        };

        return this.microsoftGraphService.patch(this.createWorkbookUrl(url), newRange, {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    // https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http
    public async setRange(address: string, values: string | any[][]) {
        const url = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}')`;

        if (!Array.isArray(values)) {
            values = JSON.parse(values) as (string | number | boolean)[][];
        }

        const newRange: WorkbookRangeUpdateBody = {
            values,
        };

        return this.microsoftGraphService.patch(this.createWorkbookUrl(url), newRange, {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    private createWorkbookUrl(url: string) {
        switch (this.session.platform) {
            case SHARE_POINT:
                return `/sites/${this.session.siteId}/drives/${this.session.driveId}/items/${this.session.fileId}/workbook`.concat(
                    url
                );
            case ONE_DRIVE:
                return `/me/drive/root:/${this.session.sessionIdentifier}:/workbook`.concat(url);
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

    private async getSiteIdByName(name: string): Promise<Site> {
        const url = `/sites?search=${name}`;

        return (await this.microsoftGraphService.get(url))['value'][0];
    }

    private async getDriveIdBySiteAndListName(siteId: string, listName: string) {
        const url = `/sites/${siteId}/drives/`;

        const data = (await this.microsoftGraphService.get(url))['value'] as Drive[];

        return data.filter(drive => drive.name === listName)[0].id;
    }

    private async getItemId(siteId: string, driveId: string, path: string) {
        const url = `/sites/${siteId}/drives/${driveId}/root:/${path}`;

        const data: DriveItem = await this.microsoftGraphService.get(url);

        return data.id;
    }

    private async createSharePointSession(input: SharePointSessionInput): Promise<Session> {
        const site = await this.getSiteIdByName(input.siteRelativePath);
        if (site === undefined) {
            throw new Error(`Site ${input.siteRelativePath} not found`);
        }

        const siteId = site.id;

        const listName = await this.getSharePointListName(siteId, input.list);

        const driveId = await this.getDriveIdBySiteAndListName(siteId, listName);

        const fileId = await this.getItemId(siteId, driveId, input.sessionIdentifier);

        return {
            platform: input.platform,
            sessionIdentifier: input.sessionIdentifier,
            workbookSessionInfo: null,
            worksheetIdentifier: input.worksheetIdentifier,
            siteId,
            driveId,
            fileId,
        };
    }

    private createOneDriveSession(
        platform: Platform,
        sessionIdentifier: SessionIdentifier,
        worksheetIdentifier: WorksheetIdentifier
    ): Session {
        return {
            platform,
            sessionIdentifier,
            workbookSessionInfo: null,
            worksheetIdentifier,
        };
    }

    private async getDefaultWorksheetIdentifier() {
        const url = this.createWorkbookUrl('/worksheets');

        const { name }: Worksheet = (await this.microsoftGraphService.get(url))['value'][0];

        return name;
    }

    private async getSharePointListName(siteId: string, listName: string) {
        const url = `/sites/${siteId}/drive`;

        if (!listName) {
            const { name } = await this.microsoftGraphService.get<Drive>(url);
            return name;
        }
        return listName;
    }

    private isValueUnclear(numberFormat: string): boolean{
        return numberFormat.includes('@') || numberFormat.includes('%');
    }
}
